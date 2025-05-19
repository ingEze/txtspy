import { type CommentPattern } from '../../../types'

/**
 * A mapping of file extensions to their respective comment patterns.
 *
 * - `single`: Symbol for single-line comments.
 * - `multiStart`: Starting symbol for multi-line comments (if applicable).
 * - `multiEnd`: Ending symbol for multi-line comments (if applicable).
 *
 * This object helps identify how comments are written in different programming languages.
 */
export const commentPatterns: Record<string, CommentPattern> = {
  '.ts': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.js': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.py': { single: '#', multiStart: '"""', multiEnd: '"""' },
  '.java': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.c': { single: '//', multiStart: '/*', multiEnd: '*/' },
  '.cpp': { single: '//', multiStart: '/*', multiEnd: '*/' }
}

/**
 * Returns the comment pattern associated with a given file extension.
 *
 * @param ext - The file extension (e.g., `.js`, `.py`).
 * @returns The comment pattern for the specified extension, or `null` if not found.
 *
 * @example
 * ```ts
 * const pattern = getCommentPattern('.js');
 * console.log(pattern.single); // '//'
 * ```
 */
export function getCommentPattern (ext: string): CommentPattern | null {
  return commentPatterns[ext] ?? null
}
