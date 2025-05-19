import fs from 'node:fs/promises'
import path from 'node:path'

import { ignoredDirs } from './scan/scanFilters.js'

/**
 * Recursively traverses a directory and returns a list of all file paths found,
 * excluding any directories listed in the `ignoredDirs` array.
 *
 * @param dir - The path to the directory to traverse.
 * @returns A promise that resolves to an array of strings, each representing
 *          the full path to a file found within the directory and its subdirectories.
 */
export async function traverseDirectory (dir: string): Promise<string[]> {
  // Read all entries (files and directories) in the current directory
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (ignoredDirs.includes(entry.name)) {
      // Skip ignored directories
      continue
    }

    if (entry.isDirectory()) {
      // Recursively traverse subdirectory
      const subFiles = await traverseDirectory(fullPath)
      files.push(...subFiles)
    } else if (entry.isFile()) {
      // Add file path to the result list
      files.push(fullPath)
    }
  }

  return files
}
