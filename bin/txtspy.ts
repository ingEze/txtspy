#!/usr/bin/env node
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import pkg from '../package.json' with { type: 'json' }

import { ChangeLangCommand, CommentsCommandsArgv, ScanCommandsArgv, SearchCommandArgs, SearchMultiFileCommandArgs } from '../types'

import { searchCommand, searchCommandMultiFile } from '../src/commands/search.js'
import { commandStats } from '../src/commands/stats.js'
import { getLang } from '../src/middleware/lang/lang.js'
import { changeLangCommand } from '../src/commands/lang.js'
import { commandComments } from '../src/commands/comments.js'
import { scanFolder } from '../src/commands/scan.js'
import { t } from '../src/i18n.js' 

import chalk from 'chalk'

let currentLang = getLang()

yargs.default(hideBin(process.argv))
  .scriptName('txtspy')
  .usage(t('USAGE', currentLang))
  .version('version', t('VERSION_DESC', currentLang), pkg.version)
  .command<SearchCommandArgs>(
    'search <word> <file>',
    t('SEARCH_DESC', currentLang),
    (yargs) => {
      yargs
        .positional('word', {
          describe: t('WORD_DESC', currentLang),
          type: 'string'
        })
        .positional('file', {
          describe: t('FILE_DESC', currentLang),
          type: 'string'
        })
    },
    searchCommand
  )
  .command<SearchMultiFileCommandArgs>(
    'multi <word> <file> <file2>',
    t('SEARCH_MULTI_DESC', currentLang),
    (yargs) => {
      yargs
        .positional('word', {
          describe: t('WORD_DESC', currentLang),
          type: 'string'
        })
        .positional('file1', {
          describe: t('FILE_DESC', currentLang),
          type: 'string'
        })
        .positional('file2', {
          describe: t('FILE_DESC', currentLang),
          type: 'string'
        })
    },
    searchCommandMultiFile
  )
  .command<SearchCommandArgs>(
    'stats <file>',
    t('STATS_DESC', currentLang),
    (yargs) => {
      yargs
        .positional('file', {
          describe: t('FILE_ANALYZE', currentLang),
          type: 'string'
        })
        .option('lang', {
          type: 'string',
          describe: t('LANG_DESC', currentLang),
          choices: ['es', 'en']
        })
        .option('all', {
          type: 'boolean',
          describe: t('STATS_ALL_DESC', currentLang)
        })
        .option('stopwords', {
          type: 'boolean',
          describe: t('STOP_WORDS_DESC', currentLang)
        })
        .option('top', {
          type: 'number',
          describe: t('TOP_WORDS_DESC', currentLang)
        })
    },
    commandStats
  )
  .command<ChangeLangCommand>(
    'lang <lang>',
    t('LANG_DESC', currentLang),
    (yargs) => {
        yargs
            .positional('lang', {
                description: t('LANG_DESC', currentLang),
                type: 'string',
                choices: ['en', 'es']
            })
    },
    changeLangCommand
  )
  .command<string>(
    'my-lang',
    t('MY_LANG_DESC', currentLang),
    () => {
      console.log(t('MY_LANG', currentLang), chalk.green(getLang()))
    }
  )
  .command<CommentsCommandsArgv>(
    'comments <file>',
    'Permite ver los comentarios de un archivo',
    (yargs) => {
      yargs
        .positional('file', {
          type: 'string',
          describe: 'Archivo que sea analizar'
        })
        .option('strict', {
          type: 'boolean',
          describe: 'Quita el modo estricto',
          default: true
        })
    },
    commandComments
  )
  .command<ScanCommandsArgv>(
    'scan <folderPath>',
    'Escanea una carpeta y muestra los archivos legibles',
    (yargs) => {
      yargs
        .positional('folderPath', {
          type: 'string',
          describe: 'Ruta o carpeta a analizar'
        })
        .option('search', {
          type: 'string',
          describe: 'Buscar palabra en los archivos legibles'
        })
    },
    scanFolder
  )
  .demandCommand(1, t('INSERT_VALID', currentLang))
  .help()
  .alias('h', 'help')
  .alias('v', 'version')
  .alias('scanFolder', 'scan')
  .strict()
  .parse()