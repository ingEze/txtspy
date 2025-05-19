export interface SearchCommandArgs {
  word: string
  files: string[]
}

export interface StatsCommnadArgs {
  word: string
  file: string
}

export interface ChangeLangCommand {
  lang: 'en' | 'es'
}

export type FunctionSearchCommand = (argv: { word: string, files: string[] }) => Promise<void>

export type FunctionViewStats = (argv: {
  file: string
  exclude?: string
  all?: string
  top?: number
  lang?: string[]
  stopwords?: boolean
}) => Promise<void>

export interface CommentPattern {
  single: string
  multiStart?: string
  multiEnd?: string
}

export interface CommentsCommandsArgv {
  file: string
  comments: boolean
  strict: boolean
}

export interface ScanCommandsArgv {
  folderPath: string
  search: string
  comments: boolean
  strict: boolean
  ignore: string
}

export interface OpenCommandsArgv {
  file: string
}

export type FunctionCommentCommand = (argv: { file: string, strict: boolean }) => Promise<void>

export type FunctionScanCommand = (argv: { folderPath: string, search?: string, comments?: boolean, strict?: boolean, ignore?: string }) => Promise<void>

export type FunctionOpenCommand = (argv: { file: string }) => Promise<void>
