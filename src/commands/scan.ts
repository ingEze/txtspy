import path from "node:path"

import { FunctionReadFolderCommands } from "../../types"
import { readFolderRecursive } from "../feature/scan/readFolderRecursive.js"

import chalk from "chalk"
import { scanDirectory } from "../feature/scan/scanDirectory.js"

/**
 * Command handler for scanning a folder and displaying readable and unreadable files.
 * 
 * This function handles the `scan` command, which can either:
 * 1. Search for a specific word in all files within a folder (and its subfolders).
 * 2. Display the count of readable and unreadable files in the folder.
 * 
 * @param folderPath - The path of the folder to scan.
 * @param search - (--flag) The word to search for in the files.
 */
export const scanFolder: FunctionReadFolderCommands = async ({ folderPath, search }) => {
  try { 
    // Resolve the absolute path of the folder
    const absolutePath = path.resolve(folderPath)
    console.log(`📁 Folder: ${chalk.greenBright.bold(path.basename(absolutePath))}`)
    
    // If a search term is provided, search for it in the folder
    if (search){
      console.log(`📎 Searched word: ${chalk.cyanBright.underline.bold(search?.trim())}\n`)
      console.log('🔍 Files:')
      const searchValue = search.trim()
      const foundMatches = await scanDirectory(absolutePath, searchValue) // Perform the search
      if (!foundMatches) {
        // If no matches are found, display a message
        console.log(chalk.redBright.bold(`❌ No matches found for ${chalk.blueBright.bold(`"${searchValue}"`)}`))
      }

      return // Exit after performing the search
    }

    // If no search term is provided, display readable/unreadable file stats
    const { readable, unreadable } = await readFolderRecursive(folderPath)
    const total = readable + unreadable

    // Display the results
    console.log(`\n📄 Files found (${total}):`)
    console.log(`✅ Readable: ${readable} | ❌ Unreadable: ${unreadable}`)
  } catch (err) {
    // Handle errors and display the error message
    console.error('❌ Error:', (err as Error).message)
  }
}