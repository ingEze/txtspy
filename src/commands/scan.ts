import path from "node:path"
import fs from 'node:fs/promises'

import { FunctionReadFolderCommands } from "../../types"
import { readableExtensions, ignoredDirs } from "../utils/scanUtils.js"

import chalk from "chalk"

/**
 * Recursively reads a folder and counts readable and unreadable files.
 * @param dir - The directory to read.
 * @param prefix - The prefix used for formatting the folder structure in the console.
 * @returns An object containing the count of readable and unreadable files.
 */
async function readFolderRecursive(dir: string, prefix = ''): Promise<{ readable: number, unreadable: number }> {
    // Read all entries (files and directories) in the current directory
    const entries = await fs.readdir(dir, { withFileTypes: true })

    // Filter out ignored directories
    const filtered = entries.filter(entry => !ignoredDirs.includes(entry.name))

    // Sort directories before files for better display
    filtered.sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()))

    // Initialize stats for readable and unreadable files
    let stats = { readable: 0, unreadable: 0 }

    // Iterate through each entry in the directory
    for (let i = 0; i < filtered.length; i++) {
        const entry = filtered[i]
        const isLast = i === filtered.length - 1 // Check if this is the last entry
        const connector = isLast ? '└── ' : '├── ' // Use different connectors for the tree structure
        const nextPrefix = prefix + (isLast ? '    ' : '│   ') // Update the prefix for subdirectories
        const fullPath = path.join(dir, entry.name) // Get the full path of the entry

        if (entry.isDirectory()) {
            // If the entry is a directory, log its name and recursively read its contents
            console.log(`${prefix}${connector}${entry.name}/`)
            const subStats = await readFolderRecursive(fullPath, nextPrefix)
            stats.readable += subStats.readable
            stats.unreadable += subStats.unreadable
        } else {
            // If the entry is a file, check its extension to determine if it's readable
            const ext = path.extname(entry.name).toLowerCase()
            const isReadable = readableExtensions.includes(ext)
            const mark = isReadable ? chalk.green('✅') : chalk.red('❌') // Mark readable or unreadable files

            // Log the file name with its status
            console.log(`${prefix}${connector}${entry.name} ${mark}`)
            isReadable ? stats.readable++ : stats.unreadable++
        }
    }

    // Return the accumulated stats
    return stats
}

/**
 * Command handler for scanning a folder and displaying readable and unreadable files.
 * @param folderPath - The path of the folder to scan.
 */
export const scanFolder: FunctionReadFolderCommands = async({ folderPath }) => {
  try { 
    // Resolve the absolute path of the folder
    const absolutePath = path.resolve(folderPath)
    console.log(`📁 Folder: ${chalk.greenBright.bold(path.basename(absolutePath))}`)

    // Recursively read the folder and get stats
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