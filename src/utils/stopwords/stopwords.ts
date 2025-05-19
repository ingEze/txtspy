import { getLang } from '../lang/lang.js'
import stopwordsData from './stopwords.json' with { type: 'json' }

export function getStopWords (lang?: 'es' | 'en'): string[] {
  const stopwordsLang = (lang != null) && (lang === 'es' || lang === 'en') ? lang : getLang()
  return stopwordsData[stopwordsLang] ?? []
}
