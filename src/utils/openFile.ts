import path from 'node:path'
import os from 'node:os'
import { exec, execSync } from 'child_process'
import { tOpenFile } from '../i18n.js'
import { getLang } from './lang/lang.js'

const currentLang = getLang()

function isWSL (): boolean {
  return os.platform() === 'linux' && process.env.WSL_DISTRO_NAME != null
}

function wslToWindowsPath (wslPath: string): string {
  try {
    return execSync(`wslpath -w "${wslPath}"`).toString().trim()
  } catch (err) {
    console.error(tOpenFile('LOG_ERROR_CONVERTING_PATH', currentLang), err)
    return wslPath
  }
}

/**
 * Opens a file or directory using the default application for the current operating system.
 *
 * - On Windows or WSL, uses `cmd.exe` with the `start` command.
 * - On macOS, uses the `open` command.
 * - On Linux, uses the `xdg-open` command.
 *
 * Handles path conversion for WSL and Windows environments.
 * Logs an error message if the file cannot be opened.
 *
 * @param dir - The path to the file or directory to open.
 */
export function openFile (dir: string): void {
  const fullPath = path.resolve(dir)
  const plataform = os.platform()

  let command

  if (plataform === 'win32' || isWSL()) {
    // WSL or Windows use command from Windows
    const winPath = isWSL() ? wslToWindowsPath(fullPath) : fullPath.replace(/\//g, '\\') // Convert / to \
    command = `cmd.exe /c start "" "${winPath}"`
  } else if (plataform === 'darwin') {
    command = `open "${fullPath}"`
  } else {
    command = `xdg-open "${fullPath}"`
  }

  exec(command, (err) => {
    if (err instanceof Error) {
      console.error(tOpenFile('LOG_ERROR_OPENING_FILE', currentLang), err.message)
    }
  })
}
