// openCommand.test.ts
import path from 'node:path'

import { openCommnad } from '../src/commands/open'
import { openFile } from '../src/utils/openFile'

jest.mock('../src/utils/openFile', () => ({
  openFile: jest.fn()
}))

jest.mock('../src/i18n', () => ({
  tLogOpen: jest.fn((key, _lang) => {
    if (key === 'LOG_OPENING_FILE') return 'Abriendo archivo'
    if (key === 'LOG_ERROR_OPENING') return 'Error al abrir'
    return ''
  })
}))

jest.mock('../src/utils/lang/lang', () => ({
  getLang: jest.fn(() => 'en')
}))

describe('openCommnad', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should be defined', () => {
    expect(openCommnad).toBeDefined()
  })

  it('should call openFile with absolute path', async () => {
    const file = '.'
    const expectedPath = path.resolve(process.cwd())

    await openCommnad({ file })

    expect(openFile).toHaveBeenCalledWith(expectedPath)
    expect(console.log).toHaveBeenCalledWith(file)
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Abriendo archivo'))
  })

  it('should log error if openFile throws', async () => {
    const errorMessage: string = 'File not found';
    (openFile as jest.Mock).mockImplementationOnce(() => { throw new Error(errorMessage) })

    await openCommnad({ file: 'somefile.txt' })

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage))
  })
})
