/**
 * Main entry point for the txtspy CLI.
 * Sets up commands, arguments, and options using yargs,
 * and applies internationalization to all help texts and descriptions.
 */

import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import pkg from '../package.json' with { type: 'json' }

import { type StatsCommnadArgs, type ChangeLangCommand, type CommentsCommandsArgv, type ScanCommandsArgv, type SearchCommandArgs, type OpenCommandsArgv } from '../types'

import { searchCommand } from '../src/commands/search.js'
import { commandStats } from '../src/commands/stats.js'
import { getLang, readConfig } from '../src/utils/lang/lang.js'
import { changeLangCommand } from '../src/commands/lang.js'
import { commandComments } from '../src/commands/comments.js'
import { scanFolder } from '../src/commands/scan.js'
import { openCommnad } from '../src/commands/open.js'

import chalk from 'chalk'

import { t } from '../src/i18n.js'

// Get the current language from config
const currentLang = getLang()
// Ensure config is loaded before running commands
readConfig()

// Configure yargs for the CLI
await yargs.default(hideBin(process.argv))
  .scriptName('txtspy')
  // Usage message (translated)
  .usage(t('USAGE', currentLang))
  // Version command
  .version('version', t('VERSION_DESC', currentLang), pkg.version)
  /**
   * Search command: searches for a word in one or more files.
   */
  .command<SearchCommandArgs>(
  'search <word> [files..]',
  t('SEARCH_DESC', currentLang),
  (yargs) => {
    yargs
      .positional('word', {
        describe: t('WORD_DESC', currentLang),
        type: 'string'
      })
      .positional('files', {
        describe: t('FILE_DESC', currentLang),
        type: 'string',
        array: true
      })
  },
  searchCommand
)
  /**
   * Stats command: displays statistics about a text file.
   */
  .command<StatsCommnadArgs>(
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
  /**
   * Lang command: changes the application's language.
   */
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
  /**
   * My-lang command: displays the current language.
   */
  .command<string>(
  'my-lang',
  t('MY_LANG_DESC', currentLang),
  () => {
    // Show the current language
    console.log(t('MY_LANG', currentLang), chalk.green(getLang()))
  }
)
  /**
   * Comments command: scans a file for comments.
   */
  .command<CommentsCommandsArgv>(
  'comments <file>',
  t('COMMENTS_DESC', currentLang),
  (yargs) => {
    yargs
      .positional('file', {
        type: 'string',
        describe: t('COMMENTS_FILE_DESC', currentLang)
      })
      .option('strict', {
        type: 'boolean',
        describe: t('COMMENTS_STRICT_DESC', currentLang),
        default: true
      })
  },
  commandComments
)
  /**
   * Scan command: scans a folder for files, optionally searching for text or comments.
   */
  .command<ScanCommandsArgv>(
  'scan <folderPath>',
  t('SCAN_DESC', currentLang),
  (yargs) => {
    yargs
      .positional('folderPath', {
        type: 'string',
        describe: t('SCAN_FOLDER_DESC', currentLang)
      })
      .option('search', {
        type: 'string',
        describe: t('SCAN_SEARCH_DESC', currentLang)
      })
      .option('comments', {
        type: 'boolean',
        describe: t('SCAN_COMMENTS_DESC', currentLang)
      })
      .option('strict', {
        type: 'boolean',
        describe: t('SCAN_STRICT_DESC', currentLang),
        default: true
      })
      .option('ignore', {
        type: 'string',
        describe: t('IGNORE_DIRS_DESC', currentLang)
      })
  },
  scanFolder
)
  /**
   * Open command: opens a file or directory.
   */
  .command<OpenCommandsArgv>(
  'open <file>',
  t('OPEN_DESC', currentLang),
  (yargs) => {
    yargs
      .positional('file', {
        type: 'string',
        describe: t('OPEN_FILE_DESC', currentLang)
      })
  },
  openCommnad
)
  // Message if no valid command is passed
  .demandCommand(1, t('INSERT_VALID', currentLang))
  // Help and aliases
  .help()
  .alias('h', 'help')
  .alias('v', 'version')
  .alias('scanFolder', 'scan')
  .alias('I', 'ignore')
  .strict()
  .parse()
