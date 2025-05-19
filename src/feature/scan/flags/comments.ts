import fs from 'node:fs/promises'
import path from 'node:path'

import { getCommentPattern } from '../../../utils/CommentPatterns/CommentPatterns.js'
import { traverseDirectory } from '../../../utils/traverseDirectory.js'
import chalk from 'chalk'
import { getLang } from '../../../utils/lang/lang.js'
import { tComments } from '../../../i18n.js'

/**
 * Gets the current application language.
 * @internal
 */
const currentLang = getLang()

/**
 * Scans all files in a directory for comments, supporting both single-line and multi-line comments.
 * Can operate in strict mode, which treats unclosed multi-line comments as errors.
 *
 * @param dir - The directory to scan for files.
 * @param strict - If true, treat unclosed multi-line comments as errors and exit with code 1.
 * @returns A promise that resolves when the scan is complete.
 *
 * @example
 * ```ts
 * await scanComments('./src', false);
 * ```
 */
export const scanComments = async (dir: string, strict: boolean): Promise<void> => {
  try {
    const files = await traverseDirectory(dir) // Get all files in the directory
    let hasErrors = false // Flag to track if any errors were found

    for (const file of files) {
      try {
        const ext = path.extname(file)
        const commentPattern = getCommentPattern(ext)

        if (commentPattern === null) {
          // Skip files without a comment pattern
          continue
        }

        const content = await fs.readFile(file, 'utf-8')
        const lines = content.split('\n')

        console.log(`\n${chalk.blueBright(`${tComments('LOG_FILE', currentLang)} ${file}`)}`)

        let insideMultiLineComment = false
        let foundComments = false
        const openComments: Array<{ line: number, content: string }> = []
        const results: string[] = []

        lines.forEach((line, index) => {
          const lineNumber = index + 1

          // Check for single-line comments
          if ((commentPattern.single != null) && line.trim().startsWith(commentPattern.single)) {
            foundComments = true
            results.push(
              chalk.bold.magentaBright(tComments('LOG_SINGLE_LINE_COMMENT', currentLang)) +
                ` ${tComments('LOG_LINE', currentLang)} ${chalk.yellow(lineNumber)} → ` +
                `${chalk.green(line.trim())}`
            )
          }

          // Check for multi-line comment start
          if ((commentPattern.multiStart != null) && line.includes(commentPattern.multiStart)) {
            insideMultiLineComment = true
            foundComments = true
            openComments.push({ line: lineNumber, content: line.trim() })
            results.push(
              chalk.bold.cyanBright(`${tComments('LOG_MULTI_LINE_COMMENT_START', currentLang)} ${tComments('LOG_LINE', currentLang)} ${lineNumber}:`) +
                ` ${chalk.yellow(line.trim())}`
            )
          } else if (insideMultiLineComment) {
            // If inside a multi-line comment, add the line to the buffer
            results.push(
              chalk.cyan(`${tComments('LOG_MULTI_LINE_COMMENT', currentLang)} ${tComments('LOG_LINE', currentLang)} ${lineNumber}:`) +
                ` ${chalk.yellow(line.trim())}`
            )

            // Check for multi-line comment end
            if ((commentPattern.multiEnd != null) && line.includes(commentPattern.multiEnd)) {
              insideMultiLineComment = false
              openComments.pop() // Remove the last open comments
              results.push(
                chalk.cyan(`${tComments('LOG_MULTI_LINE_COMMENT_END', currentLang)} ${tComments('LOG_LINE', currentLang)} ${lineNumber}:`) +
                  ` ${chalk.yellow(line.trim())}`
              )
            }
          }
        })

        // If a multi-line comment is not closed, show error/warning but continue processing
        if ((insideMultiLineComment || openComments.length > 0)) {
          const unclosedComment = openComments[0]
          if (strict) {
            // Strict mode: Show an error but continue with other files
            console.error(
              chalk.red.bold(
                `${tComments('LOG_ERROR_UNCLOSED_COMMENT', currentLang)} ${file} ${tComments('LOG_AT_LINE', currentLang)} ${unclosedComment.line}`
              )
            )
            hasErrors = true
            continue // Skip to the next file without showing additional output for this file
          } else {
            // Non-strict mode: Show a warning and continue
            console.warn(
              chalk.yellow.bold(
                `${tComments('LOG_WARNING_UNCLOSED_COMMENT', currentLang)} ${file} ${tComments('LOG_AT_LINE', currentLang)} ${unclosedComment.line}`
              )
            )
          }
        }

        if (!foundComments) {
          // If not found comments in the files
          console.log(chalk.yellow.bold(tComments('LOG_NO_COMMENTS_FOUND', currentLang)))
        }

        results.forEach((result) => { console.log(result) })
      } catch (fileError) {
        // Handle errors for individual files
        console.error(chalk.red.bold(`${tComments('LOG_ERROR_PROCESSING_FILE', currentLang)} ${file}: ${(fileError as Error).message}`))
        continue // Skip to the next file
      }
    }

    // If in strict mode and errors were found, exit with error code
    if (strict && hasErrors) {
      console.error(chalk.red.bold(`\n${tComments('LOG_ERRORS_FOUND', currentLang)}`))
      process.exit(1)
    }
  } catch (err) {
    console.error('Error:', (err as Error).message)
    process.exit(1) // Exit the program with an error code
  }
}
