import { commandComments } from '../src/commands/comments'
import { getCommentPattern } from '../src/utils/CommentPatterns/CommentPatterns'

jest.mock('node:fs', () => ({
  createReadStream: jest.fn()
}))
jest.mock('node:readline', () => ({
  createInterface: jest.fn()
}))
jest.mock('../src/utils/CommentPatterns/CommentPatterns', () => ({
  getCommentPattern: jest.fn()
}))
jest.mock('../src/i18n', () => ({
  tLogComments: jest.fn((key: string) => key)
}))
jest.mock('../src/utils/lang/lang', () => ({
  getLang: jest.fn(() => 'es')
}))

describe('commandComments', () => {
  let onMock: jest.Mock
  let rlMock: { on: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    onMock = jest.fn()
    rlMock = { on: onMock };
    (jest.requireMock('node:readline').createInterface as jest.Mock).mockReturnValue(rlMock)
  })

  it('should print comments found in the file', async () => {
    const pattern = { single: '//', multiStart: '/*', multiEnd: '*/' };
    (getCommentPattern as jest.Mock).mockReturnValue(pattern)

    const lines = [
      'const x = 1;',
      '// single comment',
      'let y = 2;',
      '/* multi',
      'line comment */',
      'console.log(x);'
    ]
    onMock.mockImplementation((event, cb) => {
      if (event === 'line') {
        lines.forEach(line => cb(line))
      }
      if (event === 'close') {
        cb()
      }
      return rlMock
    })

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    await commandComments({ file: 'test.js', strict: false })

    expect(consoleLogSpy).toHaveBeenCalled()
    expect(getCommentPattern).toHaveBeenCalledWith('.js')

    consoleLogSpy.mockRestore()
  })
})
