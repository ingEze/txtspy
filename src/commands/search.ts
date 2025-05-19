import chalk from 'chalk'
import { readFile } from 'node:fs/promises'

import { type FunctionSearchCommand } from '../../types'

import { tLogSearch } from '../i18n.js'
import { getLang } from '../utils/lang/lang.js'

/**
 * Gets the current application language.
 * @internal
 */
const currentLang = getLang()

/**
 * Highlights the searched word in its context within a line.
 *
 * @param line - The line of text to search within.
 * @param word - The word to highlight.
 * @returns An array of words representing the context around the found word.
 */
function highlightWordInContext (line: string, word: string): string[] {
  const words = line.split(/\s+/)
  const regex = new RegExp(`\\b${word}\\b`, 'i')
  const wordIndex = words.findIndex(w => regex.test(w))
  const start = Math.max(wordIndex - 5, 0)
  const end = Math.min(wordIndex + 6, words.length)
  return words.slice(start, end)
}

/**
 * Command to search for a word in multiple files and display the context.
 *
 * @param params - Object with `word` (the word to search) and `files` (array of file paths).
 * @returns A promise that resolves when the search is complete.
 *
 * @example
 * ```ts
 * await searchCommand({ word: 'example', files: ['./file1.txt', './file2.txt'] });
 * ```
 */
export const searchCommand: FunctionSearchCommand = async ({ word, files }) => {
  try {
    let found = false
    const wordLower = word.toLowerCase()
    const wordRegex = new RegExp(`\\b(${word})\\b`, 'gi')

    console.log(`🔍 => ${chalk.yellowBright.bold.underline(word)}`)

    const filesReads = await Promise.all(
      files.map(async file => await readFile(file, 'utf-8').then(data => ({ file, data })))
    )

    for (const { file, data } of filesReads) {
      const lines = data.split('\n')
      console.log(`\n${tLogSearch('LOG_FILE', currentLang)}: ${chalk.blueBright(file)}`)

      let fileHasWord = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.toLowerCase().includes(wordLower)) {
          fileHasWord = true
          found = true
          const previewWord = highlightWordInContext(line, word)
          const styledWord = previewWord
            .join(' ')
            .replace(wordRegex, chalk.white.bgRed.bold('$1')) // highlight all occurrences
          console.log(`${tLogSearch('LOG_LINE', currentLang)}: ${i + 1} - ${styledWord}`)
        }
      }

      if (!fileHasWord) {
        console.error(`${chalk.redBright.bold(tLogSearch('LOG_NOT_FOUND_WORD', currentLang))}`)
      }
    }

    if (!found) {
      console.log(tLogSearch('LOG_NOT_FOUND_WORD', currentLang))
    }
  } catch (err) {
    console.error(tLogSearch('LOG_ERROR_READING_FILE', currentLang), (err as Error).message)
    throw new Error((err as Error).message)
  }
}
