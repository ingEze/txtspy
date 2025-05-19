import fs from 'node:fs/promises'

import chalk from 'chalk'

import { type FunctionViewStats } from '../../types'
import { getStopWords } from '../utils/stopwords/stopwords.js'
import { getLang, getStopwordsLang, setStopwordsLang } from '../utils/lang/lang.js'
import { tLogsStats } from '../i18n.js'

/**
 * Gets the current application language.
 * @internal
 */
const currentLang = getLang()

/**
 * Command to display statistics about a text file, such as line count, word count,
 * unique words, most common words, and stopwords.
 *
 * @param params - Object with the following properties:
 *   - file: Path to the file to analyze.
 *   - exclude: (Optional) Comma-separated words to exclude from the analysis.
 *   - all: (Optional) If null, stopwords and excluded words are filtered out.
 *   - lang: (Optional) Language code ('en' or 'es') for stopwords.
 *   - stopwords: (Optional) If not null, prints the stopwords list for the selected language.
 *   - top: (Optional) Number of top frequent words to display.
 * @returns A promise that resolves when the statistics have been displayed.
 *
 * @example
 * ```ts
 * await commandStats({ file: './file.txt', exclude: 'the,and', all: null, lang: 'en', stopwords: null, top: 10 });
 * ```
 */
export const commandStats: FunctionViewStats = async ({ file, exclude, all, lang, stopwords, top }) => {
  try {
    if (lang != null) {
      const langValue = typeof lang === 'string' && (lang === 'es' || lang === 'en') ? lang as 'es' | 'en' : 'en'
      setStopwordsLang(langValue)
    }

    const stopwordsLanguage = typeof lang === 'string' && (lang === 'es' || lang === 'en')
      ? lang as 'es' | 'en'
      : getStopwordsLang()

    const data = await fs.readFile(file, 'utf-8')
    const lines = data.split('\n')
    const totalLines = lines.length

    const baseWords = data
      .toLowerCase()
      .replace(/[^\w\sáéíóúñü]/gi, '')
      .split(/\s+/)

    const stopwordsList = getStopWords(stopwordsLanguage)

    // If stopwords param is set, print the stopwords list and exit
    if (stopwords != null) {
      console.log(`${tLogsStats('LOG_STOPWORDS_LANG', currentLang)}: ${chalk.green.bold(stopwordsLanguage)}\n`)
      console.log(stopwordsList); return
    }

    let words = baseWords

    // If 'all' is null, filter out stopwords and excluded words
    if (all === null) {
      const excludeList = exclude
        ?.split(',')
        .map(p => p.trim().toLowerCase())
        .filter(Boolean) ?? []

      words = baseWords.filter(p =>
        p.length > 0 &&
        !stopwordsList.includes(p) &&
        !excludeList.includes(p)
      )
    }

    const totalWords = words.length

    // Count word frequencies
    const wordMap = new Map<string, number>()
    for (const word of words) {
      wordMap.set(word, (wordMap.get(word) ?? 0) + 1)
    }
    const uniqueWords = wordMap.size

    // Sort and get the top N words
    const sorted = [...wordMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, (top === null) ? 5 : top)

    const mostCommon = sorted[0]

    // Output statistics
    console.log(`${tLogsStats('LOG_STOPWORDS_LANG', currentLang)} ${chalk.green.bold(stopwordsLanguage)}`)
    console.log(chalk.bold(`📊 ${tLogsStats('LOG_STATS', currentLang)} ${chalk.underline(file)}:`))
    console.log('──────────────────────────────')
    console.log(`📝 ${tLogsStats('LOG_LINES', currentLang)} ${chalk.green(totalLines)}`)
    console.log(`🔤 ${tLogsStats('LOG_WORDS', currentLang)}: ${chalk.green(totalWords)}`)
    console.log(`🔁 ${tLogsStats('LOG_WORDS_UNIQUE', currentLang)}: ${chalk.green(uniqueWords)}`)

    if (mostCommon != null) console.log(`🏆 ${tLogsStats('LOG_MOST_COMMON_WORD', currentLang)}: ${chalk.yellow(`"${mostCommon[0]}"`)} (${mostCommon[1]} ${tLogsStats('LOG_TIMES', currentLang)})`)

    console.log(`🔝 ${tLogsStats('LOG_TOP', currentLang)} ${(top === null) ? '5' : top} ${tLogsStats('LOG_TOP_WORDS', currentLang)}:`)
    sorted.forEach(([word, count], i) => {
      console.log(`   ${i + 1}. ${chalk.cyan(word)} ${count}`)
    })
  } catch (err) {
    const error = err as Error
    console.error(chalk.red(`⚠️ ${tLogsStats('LOG_ERRROR_READ_FILE', currentLang)}: ${file}`))
    console.error(error.message)
  }
}
