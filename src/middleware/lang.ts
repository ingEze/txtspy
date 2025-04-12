import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
    
const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, '..', 'config', 'config.json')

function readConfig() {
    if (!fs.existsSync(configPath)) {
        const defaultConfig = {
            lang: 'en',
            stopwords_lang: 'en'
        }
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
        return defaultConfig
    }

    try {
        const raw = fs.readFileSync(configPath, 'utf-8')
        return JSON.parse(raw)
    } catch(err) {
        return {}
    }
}

function saveConfig (config: string) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export function getLang(): 'en' | 'es' {
    const config = readConfig()
    return config.lang || 'en'
}

export function getStopwordsLang(): 'en' | 'es' {
    const config = readConfig()
    return config.stopwords_lang || 'en'
}

export function setLang(lang: 'es' | 'en') {
    const config = readConfig()
    config.lang = lang
    saveConfig(config)
}

export function setStopwordsLang(stopwords_lang: 'es' | 'en') {
    const config = readConfig()
    config.stopwords_lang = stopwords_lang
    saveConfig(config)
}

