import path from "path"
import readline from 'node:readline'
import { createReadStream } from "node:fs"

import chalk from "chalk"
import { getCommentPattern } from "../middleware/CommentPatterns/CommentPatterns.js"
import { FunctionCommentCommands } from "../../types"

export const commandComments: FunctionCommentCommands = async ({ file, strict }) => {
    try {
            const ext = path.extname(file)
            const commentsObj = getCommentPattern(ext)

            if (!commentsObj) {
                console.error(chalk.red(`No pattern found for comments with extension ${ext}`))
            }

            const rl = readline.createInterface({
                input: createReadStream(file)
            })
            
            let index = 0
            let foundComments = false
            
            const results: string[] = []
            const openComments: { line: number, content: string }[] = []
            
            await new Promise<void>((resolve) => {
                rl.on('line', (line: string) => {
                    index++

                    // search for single line comment
                    if (commentsObj.single && 
                        (line.trim().startsWith(commentsObj.single) || line.includes(commentsObj.single))) {
                        foundComments = true
                    }

                    // search for multiline comment start
                    if (commentsObj.multiStart && line.includes(commentsObj.multiStart)) {
                        foundComments = true
                        openComments.push({ line: index, content: line })
                    }
                    // check if there is a multiline comment end
                    if (commentsObj.multiEnd && line.includes(commentsObj.multiEnd) && openComments.length > 0) {
                        openComments.pop() // remove the last open comment
                    }
                })

                rl.on('close', () => {
                    resolve()
                })
            })

            if (openComments.length > 0 && !strict) {
                openComments.sort((a, b) => a.line - b.line)
                const unclosedComment = openComments[0]
                console.error(
                    chalk.red.bold(`❌ ERROR: Comment started but not closed. Line: ${unclosedComment.line}`)
                )
                console.error(chalk.yellow.bold('If you want to continue anyway, enter the --no-strict flag'))
                process.exit(1)
                
            }

            if (strict || openComments.length === 0) {
                index = 0
                openComments.length = 0

                const rl2 = readline.createInterface({
                    input: createReadStream(file)
                })

                await new Promise<void>((resolve) => {
                    rl2.on('line', (line: string) => {
                        index++
                        
                        // if we are not in a multiline comment, look for single line comments
                        if (openComments.length === 0 && commentsObj.single && 
                            (line.trim().startsWith(commentsObj.single) || line.includes(commentsObj.single))) {
                            results.push(
                                chalk.bold.magentaBright('[Comment]') +
                                ` Line ${chalk.yellow(index)} → ` +
                                `${chalk.green(line)}`
                            )
                        }
        
                        // search for multiline comment start
                        if (commentsObj.multiStart && line.includes(commentsObj.multiStart)) {
                            openComments.push({ line: index, content: line })
                            
                            results.push(
                                chalk.bold.cyanBright(`\n> Comment start:\nline ${chalk.cyan(index)}: ${chalk.redBright(line)}`)
                            )
                        }
        
                        // if we are inside a multiline comment
                        if (openComments.length > 0) {
                            // only show the line if it's not the line where the comment was opened
                            if (openComments[openComments.length - 1].line !== index) {
                                results.push(
                                    chalk.blueBright(`🔹 Line ${index}`) +
                                    ` → ${chalk.greenBright(line)}`
                                )
                            }
                            
                            // check if the comment closes in this line
                            if (commentsObj.multiEnd && line.includes(commentsObj.multiEnd)) {
                                const lastOpenComment = openComments.pop() 
                                
                                // if the comment was opened and closed on the same line
                                if (lastOpenComment && lastOpenComment.line === index) {
                                    results.push(
                                        chalk.bold.greenBright('> Comment closed on the same line ') + chalk.cyan(index)
                                    )
                                } else {
                                    results.push(
                                        chalk.bold.redBright('🟥 End of comment:') +
                                        ` on line ${chalk.red(index)}\n`
                                    )
                                }
                            }
                        }
                    })
        
                    rl2.on('close', () => {
                        resolve()
                    })
                })
                
                results.forEach(result => console.log(result))
                
                if (openComments.length > 0 && strict) {
                    // Sort by line to show the oldest first
                    openComments.sort((a, b) => a.line - b.line)
                    const unclosedComment = openComments[0]
                    
                    console.warn(
                        chalk.yellow.bold(`⚠️ Warning: Comment started but not closed, line: ${unclosedComment.line}`)
                    )
                } else if (!foundComments) {
                    console.log(chalk.yellow.bold('🟡 No comments in this file'));
                }
            }
    } catch (error) {
        console.error('error', error)
    }
}