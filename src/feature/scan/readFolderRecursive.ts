import fs from 'node:fs/promises'
import path from 'node:path'

import { ignoredDirs, readableExtensions } from '../../utils/scan/scanFilters.js'

const cache = new Map<string, { readable: number, unreadable: number }>()

/**
 * Recursively reads a folder and counts readable and unreadable files.
 * Constructs and prints a tree structure with correct connectors showing the hierarchy.
 *
 * @param dir - Directory path to recursively scan
 * @param prefix - String prefix used for tree indentation (used in recursion)
 * @param isRoot - Boolean indicating if this is the root level directory
 * @param treeOutput - Array to collect tree structure strings (used for recursion)
 * @returns Object containing counts of readable and unreadable files
 */
export async function readFolderRecursive (
  dir: string,
  prefix = '',
  isRoot = true,
  treeOutput: string[] = []
): Promise<{ readable: number, unreadable: number }> {
  // Return cached results if available
  if (cache.has(dir)) {
    return cache.get(dir) ?? { readable: 0, unreadable: 0 }
  }

  try {
    // Read directory entries
    const entries = await fs.readdir(dir, { withFileTypes: true })

    // Filter out ignored directories
    const filtered = entries.filter(entry => !ignoredDirs.includes(entry.name))

    // Sort directories first, then files
    filtered.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1
      if (!a.isDirectory() && b.isDirectory()) return 1
      return a.name.localeCompare(b.name)
    })

    const stats = { readable: 0, unreadable: 0 }

    // Print root directory name
    if (isRoot) {
      if (dir === '.') {
        treeOutput.push('./') // Current directory
      } else {
        treeOutput.push(`${path.basename(dir)}/`)
      }
    }

    // Process each entry in the directory
    for (let i = 0; i < filtered.length; i++) {
      const entry = filtered[i]
      const isLast = i === filtered.length - 1
      const connector = isLast ? '└── ' : '├── '
      const nextPrefix = prefix + (isLast ? '    ' : '│   ')
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Handle directory - add trailing slash to indicate directory
        treeOutput.push(`${prefix}${connector}${entry.name}/`)

        // Recursively process subdirectory with the correct prefix for children
        const subStats = await readFolderRecursive(fullPath, nextPrefix, false, treeOutput)
        stats.readable += subStats.readable
        stats.unreadable += subStats.unreadable
      } else {
        // Handle file - determine if it's readable based on extension
        const ext = path.extname(entry.name).toLowerCase()
        const isReadable = readableExtensions.includes(ext)
        const mark = isReadable ? '✅' : '❌'

        treeOutput.push(`${prefix}${connector}${entry.name} ${mark}`)
        isReadable ? stats.readable++ : stats.unreadable++
      }
    }

    // Only print the formatted tree at the root level
    if (isRoot && treeOutput.length > 0) {
      console.log(treeOutput.join('\n'))
    }

    // Cache results for potential reuse
    cache.set(dir, stats)
    return stats
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, (error as Error).message)
    return { readable: 0, unreadable: 0 }
  }
}
