import { type Arguments } from 'yargs'
import { setLang } from '../utils/lang/lang.js'
import chalk from 'chalk'
import { tLogLang } from '../i18n.js'

/**
 * Changes the language of the CLI interface.
 *
 * @param argv - The arguments object passed by yargs.
 * @param argv.lang - (Required, --lang flag) The language to switch to. Accepts 'en' for English or 'es' for Spanish.
 *
 * When this command is executed, it updates the application's language setting
 * and logs a confirmation message in the selected language.
 *
 * Example usage:
 *   --lang en   → Sets the language to English
 *   --lang es   → Establece el idioma a Español
 */
export const changeLangCommand = (argv: Arguments<{ lang: 'en' | 'es' }>): void => {
  const lang = argv.lang
  setLang(lang)
  console.log(
    lang === 'en'
      ? `${tLogLang('LOG_CHANGED_TO', lang)} ${chalk.green.bold(tLogLang('LOG_ENGLISH', lang))}`
      : `${tLogLang('LOG_CHANGED_TO', lang)} ${chalk.green.bold(tLogLang('LOG_SPANISH', lang))}`
  )
}
