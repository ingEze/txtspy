import fs from 'node:fs/promises'
import { FunctionViewStats } from "../../types"
import { getStopWords } from '../utils/stopwords'
import chalk from 'chalk'
import { getStopwordsLang, setStopwordsLang } from '../middleware/lang'

export const commandStats: FunctionViewStats = async ({ file, exclude, all, lang, stopwords, top }) => {
    try {
        if (lang) {
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

        if (stopwords) {
            console.log(`Language stopwords: ${chalk.green.bold(stopwordsLanguage)}\n`)
            return console.log(stopwordsList)
        }

        let words = baseWords
        
        if(!all) {
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

        const wordMap = new Map<string, number>()
        for (const word of words) {
            wordMap.set(word, (wordMap.get(word) || 0) + 1)
        }
        const uniqueWords = wordMap.size
        

        const sorted = [...wordMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, !top ? 5 : top)

        const mostCommon = sorted[0]

        console.log(`Idioma de las stopwords ${chalk.green.bold(stopwordsLanguage)}`)
        console.log(chalk.bold(`📊 Estadísticas de ${chalk.underline(file)}:`));
        console.log('──────────────────────────────')
        console.log(`📝 Líneas: ${chalk.green(totalLines)}`)
        console.log(`🔤 Palabras: ${chalk.green(totalWords)}`)
        console.log(`🔁 Palabras únicas: ${chalk.green(uniqueWords)}`)

        if(mostCommon) console.log(`🏆 Palabra más común: ${chalk.yellow(`"${mostCommon[0]}"`)} (${mostCommon[1]} veces)`)

        console.log(`🔝 Top ${!top ? '5' : top } palabras:`)
            sorted.forEach(([word, count], i) => {
                console.log(`   ${i + 1}. ${chalk.cyan(word)} ${count}`)
            })
    } catch (err) {
        const error = err as Error
        console.error(chalk.red(`⚠️ Error al leer el archivo: ${file}`))
        console.error(error.message)
    }
}