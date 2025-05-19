import path from 'path'
import readline from 'node:readline'
import { createReadStream } from 'node:fs'

import chalk from 'chalk'
import { getCommentPattern } from '../utils/CommentPatterns/CommentPatterns.js'
import { type FunctionCommentCommand } from '../../types'
import { tLogComments } from '../i18n.js'
import { getLang } from '../utils/lang/lang.js'

const currentLang = getLang()

/**
 * Command handler for the `comments` command.
 *
 * This function scans a file for single-line and multi-line comments.
 * It supports strict mode to fail if there are unclosed multi-line comments.
 * All logs and warnings are translated using the current language.
 *
 * @param file - The file to analyze for comments.
 * @param strict - (Optional, --no-strict flag) If false, disables strict mode for comment scanning.
 */

export const commandComments: FunctionCommentCommand = async ({ file, strict }) => {
  try {
    const ext = path.extname(file)
    const commentsObj = getCommentPattern(ext)

    // Check if commentsObj is null
    if (commentsObj === null) {
      console.error(chalk.red(`${tLogComments('LOG_NO_PATTERN', currentLang)} ${ext}`))
      process.exit(1) // Exit the program if no pattern is found
    }

    const rl = readline.createInterface({
      input: createReadStream(file)
    })

    let index = 0
    let foundComments = false

    const results: string[] = []
    const openComments: Array<{ line: number, content: string }> = []

    // First pass: check for unclosed multi-line comments if strict
    await new Promise<void>((resolve) => {
      rl.on('line', (line: string) => {
        index++

        // Search for single-line comments
        if (
          commentsObj.single != null &&
          (line.trim().startsWith(commentsObj.single) || line.includes(commentsObj.single))
        ) {
          foundComments = true
        }

        // Search for multi-line comment start
        if (commentsObj.multiStart != null && line.includes(commentsObj.multiStart)) {
          foundComments = true
          openComments.push({ line: index, content: line })
        }

        // Check if there is a multi-line comment end
        if (
          commentsObj.multiEnd != null &&
          line.includes(commentsObj.multiEnd) &&
          openComments.length > 0
        ) {
          openComments.pop() // Remove the last open comment
        }
      })

      rl.on('close', () => {
        resolve()
      })
    })

    // If strict mode and unclosed comments, show error and exit
    if (openComments.length > 0 && strict) {
      openComments.sort((a, b) => a.line - b.line)
      const unclosedComment = openComments[0]
      console.error(
        chalk.red.bold(`${tLogComments('LOG_ERROR_UNCLOSED_COMMENT', currentLang)} ${unclosedComment.line}`)
      )
      console.error(chalk.yellow.bold(tLogComments('LOG_STRICT_WARNING', currentLang)))
      process.exit(1)
    }

    // Second pass: print comments if not strict or no unclosed comments
    if (!strict || openComments.length === 0) {
      index = 0
      openComments.length = 0

      const rl2 = readline.createInterface({
        input: createReadStream(file)
      })

      await new Promise<void>((resolve) => {
        rl2.on('line', (line: string) => {
          index++

          // If we are not in a multi-line comment, look for single-line comments
          if (
            openComments.length === 0 &&
            commentsObj.single != null &&
            (line.trim().startsWith(commentsObj.single) || line.includes(commentsObj.single))
          ) {
            results.push(
              chalk.bold.magentaBright(tLogComments('LOG_COMMENT', currentLang)) +
                ` ${tLogComments('LOG_LINE', currentLang)} ${chalk.yellow(index)} → ` +
                `${chalk.green(line)}`
            )
          }

          // Search for multi-line comment start
          if (commentsObj.multiStart != null && line.includes(commentsObj.multiStart)) {
            openComments.push({ line: index, content: line })

            results.push(
              chalk.bold.cyanBright(`\n${tLogComments('LOG_COMMENT_START', currentLang)}\n${tLogComments('LOG_LINE', currentLang).toLowerCase()} ${chalk.cyan(index)}: ${chalk.redBright(line)}`)
            )
          }

          // If we are inside a multi-line comment
          if (openComments.length > 0) {
            // Only show the line if it's not the line where the comment was opened
            if (openComments[openComments.length - 1].line !== index) {
              results.push(
                chalk.blueBright(`${tLogComments('LOG_LINE_CONTENT', currentLang)} ${index}`) +
                  ` → ${chalk.greenBright(line)}`
              )
            }

            // Check if the comment closes in this line
            if (commentsObj.multiEnd != null && line.includes(commentsObj.multiEnd)) {
              const lastOpenComment = openComments.pop()

              // If the comment was opened and closed on the same line
              if (lastOpenComment != null && lastOpenComment.line === index) {
                results.push(
                  chalk.bold.greenBright(tLogComments('LOG_COMMENT_CLOSED_SAME_LINE', currentLang)) + chalk.cyan(index)
                )
              } else {
                results.push(
                  chalk.bold.redBright(`${tLogComments('LOG_END_OF_COMMENT', currentLang)}`) +
                    ` ${tLogComments('LOG_ON_LINE', currentLang)} ${chalk.red(index)}\n`
                )
              }
            }
          }
        })

        rl2.on('close', () => {
          resolve()
        })
      })

      results.forEach((result) => {
        console.log(result)
      })

      if (openComments.length > 0 && !strict) {
        // Sort by line to show the oldest first
        openComments.sort((a, b) => a.line - b.line)
        const unclosedComment = openComments[0]

        console.warn(
          chalk.yellow.bold(`${tLogComments('LOG_WARNING_UNCLOSED_COMMENT', currentLang)} ${unclosedComment.line}`)
        )
      } else if (!foundComments) {
        console.log(chalk.yellow.bold(tLogComments('LOG_NO_COMMENTS', currentLang)))
      }
    }
  } catch (error) {
    console.error(tLogComments('LOG_ERROR', currentLang), error)
  }
}
