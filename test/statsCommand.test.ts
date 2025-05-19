import { commandStats } from '../src/commands/stats'
import * as fs from 'node:fs/promises'
import { getStopWords } from '../src/utils/stopwords/stopwords'

jest.mock('node:fs/promises', () => ({
  readFile: jest.fn()
}))
jest.mock('../src/utils/stopwords/stopwords', () => ({
  getStopWords: jest.fn()
}))

describe('commandStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should print stats for a file', async () => {
    const fileContent = 'hello world\nhello txtspy\n'
    ;(fs.readFile as jest.Mock).mockResolvedValue(fileContent)
    ;(getStopWords as jest.Mock).mockReturnValue(['the', 'a', 'of'])

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await commandStats({ file: 'fake.txt', exclude: undefined, all: undefined, lang: ['en'], stopwords: undefined, top: 2 })

    expect(fs.readFile).toHaveBeenCalledWith('fake.txt', 'utf-8')
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📊'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📝'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('🔤'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('🔁'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('🏆'))
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('🔝'))

    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should print stopwords if stopwords param is set', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('foo bar')
    ;(getStopWords as jest.Mock).mockReturnValue(['foo', 'bar'])

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await commandStats({ file: 'fake.txt', exclude: undefined, all: undefined, lang: ['en'], stopwords: true, top: 2 })

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.arrayContaining(['foo', 'bar']))

    consoleLogSpy.mockRestore()
  })

  it('should print error if file cannot be read', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('fail'))

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await commandStats({ file: 'fake.txt', exclude: undefined, all: undefined, lang: ['en'], stopwords: undefined, top: 2 })

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️'))

    consoleErrorSpy.mockRestore()
  })
})
