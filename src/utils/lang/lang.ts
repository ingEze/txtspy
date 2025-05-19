import fs, { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tLang } from '../../i18n.js'
import { homedir } from 'node:os'

let cachedConfig: Config | null = null

/**
 * Configuration interface that defines the structure of the txtspy config file
 * @interface Config
 */
interface Config {
  /** User interface language (English or Spanish) */
  lang: 'en' | 'es'
  /** Language used for stopwords processing */
  stopwords_lang: 'en' | 'es'
}

const configDir = join(homedir(), '.txtspy')
const configPath = join(configDir, 'config.json')

// If the "config" folder does not exist, create it now
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir)
}

// If the config file does not exist, create it with default values
if (!existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ lang: 'en' }, null, 2))
}

/**
 * Reads the application configuration from disk
 *
 * Attempts to read the configuration from the config file. If the file doesn't exist,
 * creates it with default values. Uses a cached version of the config if available.
 *
 * @returns {Config} The current application configuration
 */
export function readConfig (): Config {
  if (cachedConfig !== null) return cachedConfig

  if (!fs.existsSync(configPath)) {
    const defaultConfig: Config = {
      lang: 'en',
      stopwords_lang: 'en'
    }
    console.warn(tLang('LOG_CONFIG_FILE_NOT_FOUND', defaultConfig.lang))
    console.info(tLang('LOG_CREATING_DEFAULT_CONFIG', defaultConfig.lang))
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    return cachedConfig ?? defaultConfig
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8')
    cachedConfig = JSON.parse(raw) as Config
    return cachedConfig
  } catch (err) {
    console.error(tLang('LOG_ERROR_READING_CONFIG', 'en'), err)
    console.info(tLang('LOG_USING_DEFAULT_CONFIG', 'en'))
    return { lang: 'en', stopwords_lang: 'en' } // Return default config on error
  }
}

/**
 * Saves the configuration to disk
 *
 * Writes the provided configuration object to the config file and logs a confirmation message.
 *
 * @param {Config} config - The configuration object to save
 * @returns {void}
 */
function saveConfig (config: Config): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  console.info(tLang('LOG_CONFIG_SAVED', config.lang))
}

/**
 * Gets the current UI language setting
 *
 * Retrieves the language setting from the configuration.
 * Defaults to 'en' if not specified.
 *
 * @returns {'en' | 'es'} The current language code
 */
export function getLang (): 'en' | 'es' {
  return readConfig().lang ?? 'en'
}

/**
 * Gets the current stopwords language setting
 *
 * Retrieves the stopwords language setting from the configuration.
 * Defaults to 'en' if not specified.
 *
 * @returns {'en' | 'es'} The current stopwords language code
 */
export function getStopwordsLang (): 'en' | 'es' {
  const config = readConfig()
  return config.stopwords_lang ?? 'en'
}

/**
 * Sets the UI language
 *
 * Updates the language setting in the configuration and saves it to disk.
 *
 * @param {('en' | 'es')} lang - The language code to set
 * @returns {void}
 */
export function setLang (lang: 'es' | 'en'): void {
  const config = readConfig()
  config.lang = lang
  saveConfig(config)
}

/**
 * Sets the stopwords language
 *
 * Updates the stopwords language setting in the configuration, saves it to disk,
 * and logs a confirmation message.
 *
 * @param {('en' | 'es')} stopwordsLang - The stopwords language code to set
 * @returns {void}
 */
export function setStopwordsLang (stopwordsLang: 'es' | 'en'): void {
  const config = readConfig()
  config.stopwords_lang = stopwordsLang
  saveConfig(config)
  console.info(`${tLang('LOG_STOPWORDS_LANG_SET_TO', config.lang)} ${stopwordsLang}`)
}
