import { searchCommand } from '../src/commands/search'
import { readFile } from 'node:fs/promises'

jest.mock('node:fs/promises', () => ({
  readFile: jest.fn()
}))
jest.mock('../src/i18n', () => ({
  tLogSearch: jest.fn((key: string) => {
    if (key === 'LOG_FILE') return 'Archivo'
    if (key === 'LOG_LINE') return 'Línea'
    if (key === 'LOG_NOT_FOUND_WORD') return 'No encontrado'
    if (key === 'LOG_ERROR_READING_FILE') return 'Error'
    return key
  })
}))
jest.mock('../src/utils/lang/lang', () => ({
  getLang: jest.fn(() => 'es')
}))

describe('searchCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should print lines containing the word in each file', async () => {
    (readFile as jest.Mock)
      .mockResolvedValueOnce('hello world\nthis is a test\nsearch here\n')
      .mockResolvedValueOnce('no match here\nanother line\nsearch again\n')

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await searchCommand({ word: 'search', files: ['file1.txt', 'file2.txt'] })

    expect(readFile).toHaveBeenCalledWith('file1.txt', 'utf-8')
    expect(readFile).toHaveBeenCalledWith('file2.txt', 'utf-8')
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('search'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Archivo'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Línea'))

    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should print not found message if word is not found', async () => {
    (readFile as jest.Mock).mockResolvedValue('no matches here\nanother line\n')

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await searchCommand({ word: 'missing', files: ['file1.txt'] })

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('No encontrado'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No encontrado'))

    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should print error if file cannot be read', async () => {
    (readFile as jest.Mock).mockRejectedValue(new Error('fail'))

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await expect(searchCommand({ word: 'search', files: ['file1.txt'] })).rejects.toThrow('fail')
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error'), expect.stringContaining('fail'))

    consoleErrorSpy.mockRestore()
  })
})
