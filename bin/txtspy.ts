#!/usr/bin/env node
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import pkg from '../package.json'

import { ChangeLangCommand, SearchCommandArgs, SearchMultiFileCommandArgs } from '../types'

import { t } from '../src/i18n' 

import { searchCommand, searchCommandMultiFile } from '../src/commands/search'
import { commandStats } from '../src/commands/stats'
import { getLang } from '../src/middleware/lang'
import { changeLangCommand } from '../src/commands/lang'
import chalk from 'chalk'

let currentLang = getLang()

yargs.default(hideBin(process.argv))
  .scriptName('txtspy')
  .usage(t('USAGE', currentLang))
  .version('version', t('VERSION_DESC', currentLang), pkg.version)
  .alias('v', 'version')
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
  .demandCommand(1, t('INSERT_VALID', currentLang))
  .help()
  .alias('h', 'help')
  .strict()
  .parse()