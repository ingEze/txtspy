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
                console.error(chalk.red(`No se encontró patrón de comentarios para la extensión ${ext}`))
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

                    // buscar comentario de una linea
                    if (commentsObj.single && 
                        (line.trim().startsWith(commentsObj.single) || line.includes(commentsObj.single))) {
                        foundComments = true
                    }

                    // buscar inicio de comentario multilinea
                    if (commentsObj.multiStart && line.includes(commentsObj.multiStart)) {
                        foundComments = true
                        openComments.push({ line: index, content: line })
                    }
                    // verificar si hay cierre de comentario multilinea
                    if (commentsObj.multiEnd && line.includes(commentsObj.multiEnd) && openComments.length > 0) {
                        openComments.pop() // eliminar el ultimo comentario abierto
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
                    chalk.red.bold(`❌ ERROR: Comentario iniciado pero no cerrado. Línea: ${unclosedComment.line}`)
                )
                console.error(chalk.yellow.bold('Si desea continuar igual, ingrese la flag --no-strict'))
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
                        
                        // si no estamos en un comentario multilinea, buscar comentarios de una sola línea
                        if (openComments.length === 0 && commentsObj.single && 
                            (line.trim().startsWith(commentsObj.single) || line.includes(commentsObj.single))) {
                            results.push(
                                chalk.bold.magentaBright('[Comentario]') +
                                ` Línea ${chalk.yellow(index)} → ` +
                                `${chalk.green(line)}`
                            )
                        }
        
                        // buscar inicio de comentario multilinea
                        if (commentsObj.multiStart && line.includes(commentsObj.multiStart)) {
                            openComments.push({ line: index, content: line })
                            
                            results.push(
                                chalk.bold.cyanBright(`\n> Inicio de comentario:\nlínea ${chalk.cyan(index)}: ${chalk.redBright(line)}`)
                            )
                        }
        
                        // si estamos dentro de un comentario multilinea
                        if (openComments.length > 0) {
                            // solo mostrar la linea si no es la línea donde se abrió el comentario
                            if (openComments[openComments.length - 1].line !== index) {
                                results.push(
                                    chalk.blueBright(`🔹 Línea ${index}`) +
                                    ` → ${chalk.greenBright(line)}`
                                )
                            }
                            
                            // verificar si el comentario se cierra en esta línea
                            if (commentsObj.multiEnd && line.includes(commentsObj.multiEnd)) {
                                const lastOpenComment = openComments.pop() 
                                
                                // si el comentario se abrió y cerró en la misma línea
                                if (lastOpenComment && lastOpenComment.line === index) {
                                    results.push(
                                        chalk.bold.greenBright('> Comentario cerrado en la misma línea ') + chalk.cyan(index)
                                    )
                                } else {
                                    results.push(
                                        chalk.bold.redBright('🟥 Fin de comentario:') +
                                        ` en línea ${chalk.red(index)}\n`
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
                    // Ordenar por línea para mostrar primero el más antiguo
                    openComments.sort((a, b) => a.line - b.line)
                    const unclosedComment = openComments[0]
                    
                    console.warn(
                        chalk.yellow.bold(`⚠️ Advertencia: Comentario iniciado pero no cerrado, línea: ${unclosedComment.line}`)
                    )
                } else if (!foundComments) {
                    console.log(chalk.yellow.bold('🟡 No hay comentarios en este archivo'));
                }
            }
    } catch (error) {
        console.error('error', error)
    }
}