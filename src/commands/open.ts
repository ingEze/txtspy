import path from 'node:path'
import chalk from 'chalk'

import { openFile } from '../utils/openFile.js'
import { type FunctionOpenCommand } from '../../types'
import { tLogOpen } from '../i18n.js'
import { getLang } from '../utils/lang/lang.js'

/**
 * Gets the current application language.
 * @internal
 */
const currentLang = getLang()

/**
 * Command to open a file or directory.
 *
 * @param params - Object with the `file` property indicating the path to open.
 * @returns A promise that resolves when the file or directory has been opened.
 *
 * @example
 * ```ts
 * await openCommnad({ file: './file.txt' });
 * ```
 */
export const openCommnad: FunctionOpenCommand = async ({ file }) => {
  console.log(file)
  try {
    // If the file is '.', use the current working directory
    if (file === '.') file = process.cwd()
    const dir = path.resolve(file)
    console.log(`${tLogOpen('LOG_OPENING_FILE', currentLang)}: ${chalk.green.bold(dir)}`)
    openFile(dir)
  } catch (error) {
    // Handles errors when trying to open the file or directory
    console.error(chalk.red(`${tLogOpen('LOG_ERROR_OPENING', currentLang)}: ${(error as Error).message}`))
  }
}
