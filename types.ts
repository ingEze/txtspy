export interface SearchCommandArgs {
    word: string
    file: string
}

export interface SearchMultiFileCommandArgs {
    word: string
    file: string
    file2: string
}

export interface ChangeLangCommand { 
    lang: 'en' | 'es'
}

export type FunctionSearchCommand = (argv: { word:string, file: string }) => void

export type FunctionSearchMultiFileCommand = (argv: { word:string, file:string, file2:string }) => void

export type FunctionViewStats = (argv: { 
    file: string, 
    exclude?: string, 
    all?: string, 
    top?: number, 
    lang?: string[],
    stopwords?: boolean
}) => void


export type CommentPattern = {
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
}

export type FunctionCommentCommands = (argv: { file: string, strict: boolean }) => void

export type FunctionReadFolderCommands = (argv: { folderPath: string }) => void

