import { tLogsStats } from '../../i18n.js'
import { getLang } from '../../utils/lang/lang.js'

const currentLang = getLang()

export function getWordLengthBuckets (words: string[]): Record<string, number> {
  const buckets = {
    '1-3': 0,
    '4-6': 0,
    '7-9': 0,
    '10+': 0
  }

  for (const word of words) {
    const len = word.length
    if (len <= 3) buckets['1-3']++
    else if (len <= 6) buckets['4-6']++
    else if (len <= 9) buckets['7-9']++
    else buckets['10+']++
  }

  return buckets
}

export function printWordLengthDistribution (buckets: Record<string, number>): string {
  const maxCount = Math.max(...Object.values(buckets))

  const generateBar = (count: number, max: number, barLength = 15): string => {
    const scaled = Math.round((count / max) * barLength)
    return '█'.repeat(scaled).padEnd(barLength, ' ')
  }

  let output = `\n🔠 ${tLogsStats('LOG_WORD_LENGTH_DISTRIBUTION', currentLang)}:`
  for (const [range, count] of Object.entries(buckets)) {
    const bar = generateBar(count, maxCount)
    output += (`\n ${range.padEnd(5)} : ${bar}   ${count}`)
  }
  return output
}
