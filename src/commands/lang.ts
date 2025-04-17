import { Arguments } from "yargs"
import { setLang } from "../middleware/lang/lang.js" 
import chalk from "chalk"

export const changeLangCommand = (argv: Arguments<{ lang: 'en' | 'es' }>) => {
    const lang = argv.lang
    setLang(lang)
    console.log(lang === 'en' ? `Language changed to ${chalk.green.bold('English')}` : `Idioma cambiado a ${chalk.green.bold('Español')}` )
}