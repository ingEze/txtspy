import fs from 'node:fs/promises'
import path from 'node:path'

import { ignoredDirs, readableExtensions } from '../../utils/scan/scanFilters.js'

const cache = new Map<string, { readable: number, unreadable: number }>()

/**
 * Recursively reads a folder and counts readable and unreadable files.
 * @param dir - The directory to read.
 * @param prefix - The prefix used for formatting the folder structure in the console.
 * @returns An object containing the count of readable and unreadable files.
 */
export async function readFolderRecursive (dir: string, prefix = ''): Promise<{ readable: number, unreadable: number }> {
  if (cache.has(dir)) {
    return cache.get(dir) ?? { readable: 0, unreadable: 0 }
  }

  // Read all entries (files and directories) in the current directory
  const entries = await fs.readdir(dir, { withFileTypes: true })

  // Filter out ignored directories
  const filtered = entries.filter(entry => !ignoredDirs.includes(entry.name))

  // Sort directories before files for better display
  filtered.sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()))

  // Initialize stats for readable and unreadable files
  const stats = { readable: 0, unreadable: 0 }

  const processEntries = async (): Promise<void> => {
    const output: string[] = []

    // Process all entries in parallel using Promise.all
    const results = await Promise.all(
      filtered.map(async (entry, i) => {
        const isLast = i === filtered.length - 1
        const connector = isLast ? '└── ' : '├── '
        const nextPrefix = prefix + (isLast ? '    ' : '│   ')
        const fullPath = path.join(dir, entry.name)

        const entryOutput: string[] = []
        const entryStats = { readable: 0, unreadable: 0 }

        if (entry.isDirectory()) {
          entryOutput.push(`${prefix}${connector}${entry.name}/`)
          const subStats = await readFolderRecursive(fullPath, nextPrefix)
          entryStats.readable = subStats.readable
          entryStats.unreadable = subStats.unreadable
        } else {
          const ext = path.extname(entry.name).toLowerCase()
          const isReadable = readableExtensions.includes(ext)
          const mark = isReadable ? '✅' : '❌'
          entryOutput.push(`${prefix}${connector}${entry.name} ${mark}`)
          isReadable ? entryStats.readable = 1 : entryStats.unreadable = 1
        }

        return {
          output: entryOutput,
          stats: entryStats,
          index: i // Keep track of original order
        }
      })
    )

    // Sort results back into original order and accumulate stats
    results.sort((a, b) => a.index - b.index)

    for (const result of results) {
      output.push(...result.output)
      stats.readable += result.stats.readable
      stats.unreadable += result.stats.unreadable
    }

    // Output the complete structure for this directory
    if (output.length > 0) {
      console.log(output.join('\n'))
    }
  }

  // Process entries and build the directory structure
  await processEntries()

  cache.set(dir, stats)

  // Return the accumulated stats
  return stats
}
