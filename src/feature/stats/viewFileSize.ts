import chalk from 'chalk'
import { stat } from 'fs/promises'

export async function viewFileSize (file: string): Promise<string> {
  const fileSize = await stat(file)
  const bytes = fileSize.size

  let output = 'File size:'
  if (bytes < 1024) {
    output += (` ${chalk.green(bytes)} B`)
  } else if (bytes < 1024 * 1024) {
    output += (` ${chalk.yellow((bytes / 1024).toFixed(2))} KB`)
  } else {
    output += (` ${chalk.redBright((bytes / (1024 * 1024)).toFixed(2))} MB`)
  }

  return output
}
