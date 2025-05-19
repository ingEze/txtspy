import { changeLangCommand } from '../src/commands/lang'

import { setLang } from '../src/utils/lang/lang'

import { tLogLang } from '../src/i18n'

jest.mock('../src/utils/lang/lang', () => ({
  setLang: jest.fn()
}))

describe('changeLangCommand', () => {
  it('should change the language and display a confirmation message', async () => {
    (setLang as jest.Mock).mockResolvedValue(undefined)

    const changeLang = 'es'
    let consoleLogResponse
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    changeLang === 'es'
      ? consoleLogResponse = tLogLang('LOG_CHANGED_TO', 'es')
      : consoleLogResponse = tLogLang('LOG_CHANGED_TO', 'en')

    changeLangCommand({
      lang: changeLang,
      _: [],
      $0: ''
    })

    expect(setLang).toHaveBeenCalledWith(changeLang)
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(consoleLogResponse))

    consoleLogSpy.mockRestore()
  })
})
