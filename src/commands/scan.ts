import path from 'node:path'

import { readFolderRecursive } from '../feature/scan/readFolderRecursive.js'
import { scanDirectory } from '../feature/scan/flags/search.js'
import { scanComments } from '../feature/scan/flags/comments.js'
import { getLang } from '../utils/lang/lang.js'
import { tLogScan } from '../i18n.js'

import { type FunctionScanCommand } from '../../types'

import chalk from 'chalk'
import { ignoredDirs } from '../utils/scan/scanFilters.js'
const currentLang = getLang()

/**
 * Command handler for the `scan` command.
 *
 * This function allows you to:
 * 1. Search for a specific word in all files within a folder (and its subfolders) using the `--search` flag.
 * 2. Display only files with comments using the `--comments` flag (with optional strict mode).
 * 3. Show the count of readable and unreadable files in the folder if no flags are provided.
 *
 * @param folderPath - The path of the folder to scan.
 * @param search - (Optional, --search flag) The word to search for in the files.
 * @param comments - (Optional, --comments flag) If true, displays the comments in the files.
 * @param strict - (Optional, --no-strict flag) When set to false, disables strict mode for comment scanning.
 */
export const scanFolder: FunctionScanCommand = async ({ folderPath, search, comments, strict, ignore }) => {
  let ignoredDirsBackup: string[] | undefined
  try {
    // Resolve the absolute path of the folder
    const absolutePath = path.resolve(folderPath)
    console.log(`📁 ${tLogScan('LOG_FOLDER', currentLang)}: ${chalk.greenBright.bold(path.basename(absolutePath))}`)

    // If a search term is provided, search for it in the folder
    if (search != null) {
      console.log(`📎 ${tLogScan('LOG_SEARCHED_WORD', currentLang)}: ${chalk.cyanBright.underline.bold(search?.trim())}\n`)
      console.log(`🔍 ${tLogScan('LOG_FILES', currentLang)}:`)
      const searchValue = search.trim()
      const foundMatches = await scanDirectory(absolutePath, searchValue) // Perform the search
      if (!foundMatches) {
        // If no matches are found, display a message
        console.log(chalk.redBright.bold(`❌ ${tLogScan('LOG_NO_MATCHES', currentLang)} ${chalk.blueBright.bold(`"${searchValue}"`)}`))
      }

      return // Exit after performing the search
    }

    if (comments != null) {
      console.log(strict != null
        ? chalk.yellow(tLogScan('LOG_STRICT_MODE', currentLang))
        : chalk.blue(tLogScan('LOG_NON_STRICT_MODE', currentLang))
      )
      await scanComments(folderPath, strict ?? false)
      return
    }

    if (ignore?.trim() !== undefined && ignore?.trim() !== '') {
      ignoredDirsBackup = [...ignoredDirs]
      ignoredDirs.push(ignore)
    }

    // If no search term is provided, display readable/unreadable file stats
    const { readable, unreadable } = await readFolderRecursive(folderPath)
    const total = readable + unreadable

    // Display the results
    console.log(`\n📄 ${tLogScan('LOG_FILES_FOUND', currentLang)} (${total}):`)
    console.log(`✅ ${tLogScan('LOG_READABLE', currentLang)}: ${readable} | ❌ ${tLogScan('LOG_UNREADABLE', currentLang)}: ${unreadable}`)
  } catch (err) {
    // Handle errors and display the error message
    console.error(`❌ ${tLogScan('LOG_ERROR', currentLang)}:`, (err as Error).message)
  } finally {
    if (ignoredDirsBackup != null) {
      ignoredDirs.length = 0
      ignoredDirs.push(...ignoredDirsBackup)
    }
  }
}
