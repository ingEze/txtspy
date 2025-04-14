import chalk from 'chalk'

import fs from 'node:fs/promises'

import { FunctionSearchCommand, FunctionSearchMultiFileCommand } from '../../types'

import { tLogSearch } from '../i18n'
import { getLang } from '../middleware/lang'


let currentLang = getLang()

function highlightWordInContext(line: string, word: string) {
    const words = line.split(' ')
    const wordIndex = words.findIndex(w => w.includes(word))
    const start = Math.max(wordIndex - 5, 0)
    const end = Math.min(wordIndex + 6, words.length)
    const previewWord = words.slice(start, end)
    return previewWord
}

export const searchCommand: FunctionSearchCommand = async ({ word, file }) => {
    try {
        const data = await fs.readFile(file, 'utf-8')
        const lines = data.split('\n')
        let found = false

        lines.forEach((line, index) => {
            if(line.includes(word)) {
                found = true
                const previewWord = highlightWordInContext(line, word)
                const styledWord = previewWord.join(' ').replace(word, chalk.white.bgRed.bold(word))

                console.log(`${tLogSearch('LOG_LINE', currentLang)}: ${index + 1} - ${styledWord}`)
            }
        })

        if (found === false) console.error(`${tLogSearch('LOG_NOT_FOUND_WORD', currentLang)} - ${tLogSearch('LOG_FILE', currentLang)}: ${file}`)
    } catch (err) {
        const error = err as Error
        console.error(tLogSearch('LOG_ERROR_READING_FILE', currentLang), error.message)
        throw new Error(error.message)
    }

}

export const searchCommandMultiFile: FunctionSearchMultiFileCommand = async ({ word, file, file2 }) => {
    try{
        const [fileContent, fileContent2] = await Promise.all([
            fs.readFile(file, 'utf-8'),
            fs.readFile(file2, 'utf-8')
        ])
        
        const lines = fileContent.split('\n')
        const lines2 = fileContent2.split('\n')
        let foundFile = false 
        let foundFile2 = false
        let counterFile = 0
        let counterFile2 = 0

        lines.forEach((line, index) => {
            if (line.includes(word)) {
                foundFile = true
                counterFile++
                const previewWord = highlightWordInContext(line, word)
                const styledWord = previewWord.join(' ').replace(word, chalk.white.bgRed.bold(word))
                const styledFileName = chalk.blueBright.bold(file)
                console.log(`${tLogSearch('LOG_FILE', currentLang)}: ${styledFileName} - ${tLogSearch('LOG_LINE', currentLang)}: ${index + 1} - ${styledWord}`)
            }
        })
        if(foundFile === false) console.log(`${tLogSearch('LOG_FILE', currentLang)}: ${file} ${tLogSearch('LOG_WORD_NOT_FOUND_IN_FILE', currentLang)}: ${word}`)

        lines2.forEach((line, index) => {
            if(line.includes(word)) {
                foundFile2 = true
                counterFile2++
                const previewWord = highlightWordInContext(line, word)
                const styledWord = previewWord.join(' ').replace(word, chalk.white.bgRedBright.bold(word))
                const styledFileName = chalk.cyan.bold(file2)
                console.log(`${tLogSearch('LOG_FILE', currentLang)}: ${styledFileName} - ${tLogSearch('LOG_LINE', currentLang)}: ${index + 1} - ${styledWord}`)
            }
        })
        if (foundFile2 === false) {
            console.log(`${tLogSearch('LOG_FILE', currentLang)}: ${file2} ${tLogSearch('LOG_WORD_NOT_FOUND_IN_FILE', currentLang)}: ${word}`)
        } else {
            console.log(`
${tLogSearch('LOG_FILE', currentLang)} ${chalk.blueBright.bold(file)} - ${tLogSearch('LOG_WORD_FOUND_COUNT', currentLang)} ${chalk.red.bold(word)}: ${chalk.green.bold(counterFile)}
${tLogSearch('LOG_FILE', currentLang)} ${chalk.cyan.bold(file2)} - ${tLogSearch('LOG_WORD_FOUND_COUNT', currentLang)} ${chalk.redBright.bold(word)}: ${chalk.greenBright.bold(counterFile2)}
                `)
        }
    } catch(err){
        const error = err as Error
        console.error(`${tLogSearch('LOG_ERROR_READING_FILES', currentLang)}: ` , error.message)
        throw new Error(error.message)
    }
}
