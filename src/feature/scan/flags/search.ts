import fs from 'node:fs/promises'
import path from 'node:path'

import chalk from 'chalk'
import { traverseDirectory } from '../../../utils/traverseDirectory.js'

let foundAtLeastOneMatch = false // Tracks whether at least one match was found during the scan

/**
 * Recursively scans a directory and its subdirectories for a specific word.
 *
 * This function searches for a given word in all files within the specified directory
 * and its subdirectories. If matches are found, they are logged to the console.
 *
 * @param dir - The path of the folder to scan.
 * @param searchValue - The word to search for in the files.
 * @returns A boolean indicating whether at least one match was found.
 */
export async function scanDirectory (dir: string, searchValue: string): Promise<boolean> {
  try {
    const files = await traverseDirectory(dir) // Get all files in the directory

    for (const file of files) {
      await analyzeFile(file, searchValue) // Analyze each file for the search value
    }

    return foundAtLeastOneMatch // Return whether matches were found
  } catch (err) {
    // Handle errors and display the error message
    console.error('Error:', (err as Error).message)
    return false
  }
}

/**
 * Analyzes a single file for occurrences of a specific word.
 *
 * This function reads the content of a file and searches for occurrences of the
 * specified word. If matches are found, they are logged to the console.
 *
 * @param filePath - The path of the file to analyze.
 * @param searchValue - The word to search for in the file.
 */
export async function analyzeFile (filePath: string, searchValue: string): Promise<void> {
  // Read the content of the file
  const content = await fs.readFile(filePath, 'utf-8')

  // Extract the folder and file names for display
  const folderName = path.basename(path.dirname(filePath))
  const fileName = path.basename(filePath)
  const result = `${chalk.gray.bold(folderName)}/${chalk.blueBright.bold(fileName)}`

  // Escape special characters in the search value and create a case-insensitive regex
  const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'gi') // g = global, i = ignore case

  // Find matches in the file content
  const matches = content.match(regex)
  const count = (matches != null) ? matches.length : 0

  if (count > 0) {
    // If matches are found, log the file name and match count
    console.log(`${result} - (${chalk.green(count)})`)
    foundAtLeastOneMatch = true // Update the match tracker
  }
}
