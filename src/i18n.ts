import { translations } from './translation/txtspy.t.js'
import { translationsLogsFileStats } from './translation/commands.t/commandStats.t.js'
import { translationsLogsFileSearch } from './translation/commands.t/commandSearch.t.js'
import { translationsLogsFileComments } from './translation/commands.t/commandComents.t.js'
import { translationsLogsFileLang } from './translation/commands.t/commandLang.t.js'
import { translationsLogsFileOpen } from './translation/commands.t/commandOpen.t.js'
import { translationsLogsFileScan } from './translation/commands.t/commandScan.t.js'
import { translationsLang } from './translation/utils.t/lang.t.js'
import { translationsComments } from './translation/utils.t/comments.t.js'
import { translationsOpenFile } from './translation/utils.t/openFile.t.js'

/**
 * Supported language codes.
 */
export type Lang = 'es' | 'en'

/**
 * Returns a translated string for a general application key.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const t = (key: keyof typeof translations['en'], lang: Lang): string => {
  return translations[lang][key]
}

/**
 * Returns a translated string for file statistics commands.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLogsStats = (key: keyof typeof translationsLogsFileStats['en'], lang: Lang): string => {
  return translationsLogsFileStats[lang][key]
}

/**
 * Returns a translated string for search commands.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLogSearch = (key: keyof typeof translationsLogsFileSearch['en'], lang: Lang): string => {
  return translationsLogsFileSearch[lang][key]
}

/**
 * Returns a translated string for comments commands.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLogComments = (key: keyof typeof translationsLogsFileComments['en'], lang: Lang): string => {
  return translationsLogsFileComments[lang][key]
}

/**
 * Returns a translated string for language commands.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLogLang = (key: keyof typeof translationsLogsFileLang['en'], lang: Lang): string => {
  return translationsLogsFileLang[lang][key]
}

/**
 * Returns a translated string for open file commands.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLogOpen = (key: keyof typeof translationsLogsFileOpen['en'], lang: Lang): string => {
  return translationsLogsFileOpen[lang][key]
}

/**
 * Returns a translated string for scan commands.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLogScan = (key: keyof typeof translationsLogsFileScan['en'], lang: Lang): string => {
  return translationsLogsFileScan[lang][key]
}

/**
 * Returns a translated string for language utility keys.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tLang = (key: keyof typeof translationsLang['en'], lang: Lang): string => {
  return translationsLang[lang][key]
}

/**
 * Returns a translated string for comments utility keys.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tComments = (key: keyof typeof translationsComments['en'], lang: Lang): string => {
  return translationsComments[lang][key]
}

/**
 * Returns a translated string for open file utility keys.
 * @param key - The translation key.
 * @param lang - The language code.
 * @returns The translated string.
 */
export const tOpenFile = (key: keyof typeof translationsOpenFile['en'], lang: Lang): string => {
  return translationsOpenFile[lang][key]
}
