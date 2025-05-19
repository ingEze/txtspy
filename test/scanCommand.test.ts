// scanFolder.test.ts
import path from 'path'

import { scanFolder } from '../src/commands/scan'
import { readFolderRecursive } from '../src/feature/scan/readFolderRecursive'
import { scanDirectory } from '../src/feature/scan/flags/search'
import { scanComments } from '../src/feature/scan/flags/comments'

jest.mock('../src/feature/scan/readFolderRecursive', () => ({
  readFolderRecursive: jest.fn()
}))

jest.mock('../src/feature/scan/flags/search', () => ({
  scanDirectory: jest.fn()
}))

jest.mock('../src/feature/scan/flags/comments', () => ({
  scanComments: jest.fn()
}))

describe('scanFolder', () => {
  it('should display total readable and unreadable files when no flag is provided', async () => {
    // simulate return mock with readFolderRecursive
    (readFolderRecursive as jest.Mock).mockResolvedValue({
      readable: 5,
      unreadable: 2
    })

    const folderPath = 'fake-folder'
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await scanFolder({ folderPath, search: undefined, comments: undefined, strict: false })

    expect(readFolderRecursive).toHaveBeenCalledWith(folderPath)
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📄')) // icon used for files output

    consoleLogSpy.mockRestore()
  })
  it('should search for a word in files using the --search flag', async () => {
    // Simulate a successful scan that finds the word
    (scanDirectory as jest.Mock).mockResolvedValue(true)

    const folderPath = 'fakeDIr'
    const search = 'console.log'
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await scanFolder({ folderPath, search, comments: undefined, strict: undefined })

    expect(scanDirectory).toHaveBeenCalledWith(path.resolve(folderPath), search)
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📎')) // Icon used for search result

    consoleLogSpy.mockRestore()
  })
  it('should display files containing comments using the --comments flag (with strict mode)', async () => {
    // We simulate that scanComments runs but returns nothing (undefined)
    (scanComments as jest.Mock).mockResolvedValue(undefined)

    const folderPath = 'fake-folder'
    const strictMode = true
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await scanFolder({ folderPath, search: undefined, comments: true, strict: strictMode })

    expect(scanComments).toHaveBeenCalledWith(folderPath, strictMode)
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📁')) // Icon used for folders or comment result

    consoleLogSpy.mockRestore()
  })
})
