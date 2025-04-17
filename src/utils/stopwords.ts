import { getLang } from '../middleware/lang/lang.js'
import stopwordsData from './stopwords.json' with { type: 'json' }
 
export function getStopWords(lang?: 'es' | 'en'): string[] {
    const stopwordsLang = lang && (lang === 'es' || lang === 'en') ? lang : getLang()
    return stopwordsData[stopwordsLang] ?? []
}
