import { getLang } from '../middleware/lang'
import stopwordsData from './stopwords.json'

export function getStopWords(lang?: 'es' | 'en'): string[] {
    const stopwordsLang = lang && (lang === 'es' || lang === 'en') ? lang : getLang()
    return stopwordsData[stopwordsLang] ?? []
}
