import { CommentPattern } from '../../../types'

export const commentPatterns: { [key: string]: CommentPattern } = {
  '.ts': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.js': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.py': { single: '#' },
  '.java': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.c': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.cpp': { single: '//', multiStart: '/*', multiEnd: '*/' }
}

export function getCommentPattern(ext: string) {
  return commentPatterns[ext] || null
}