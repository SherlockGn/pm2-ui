import { exec } from 'node:child_process'
import { join } from 'node:path'
import { readdir, stat, open } from 'node:fs/promises'
import { platform } from 'node:os'

export const listWindowsDisks = async () => {
    return new Promise((resolve, reject) => {
        exec(
            'wmic logicaldisk get caption',
            { windowsHide: true },
            (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else if (stderr) {
                    reject(stderr)
                } else {
                    resolve(
                        stdout
                            .split('\n')
                            .map(i => i.trim())
                            .filter(i => i.endsWith(':'))
                    )
                }
            }
        )
    })
}

export const walk = async paths => {
    let full =
        paths.length === 0 ? '' : paths.length === 1 ? paths[0] : join(...paths)

    const isWin = platform() === 'win32'
    if (isWin && full.endsWith(':')) {
        full += '\\'
    }

    if (full === '' && isWin) {
        return {
            folders: await listWindowsDisks(),
            files: []
        }
    }

    const ret = {
        folders: [],
        files: []
    }

    for (const item of await readdir(full)) {
        try {
            const status = await stat(join(full, item))
            if (status.isDirectory()) {
                ret.folders.push(item)
            } else {
                ret.files.push(item)
            }
        } catch (e) {
            console.error(e.message)
        }
    }
    return ret
}

export const readLastLines = async (
    input_file_path,
    maxLineCount,
    encoding = 'utf8'
) => {
    const NEW_LINE_CHARACTERS = ['\n']
    let fileHandle = null

    try {
        // Check existence and get stats
        const state = await stat(input_file_path)
        fileHandle = await open(input_file_path, 'r')

        let charsRead = 0
        let lineCount = 0
        let lines = ''

        // Loop backwards until we hit maxLineCount or the start of the file
        while (lines.length < state.size && lineCount < maxLineCount) {
            const position = state.size - 1 - charsRead
            const buffer = Buffer.alloc(1)

            // Read a single character from the end
            const { bytesRead } = await fileHandle.read(buffer, 0, 1, position)

            if (bytesRead > 0) {
                const nextCharacter = String.fromCharCode(buffer[0])
                lines = nextCharacter + lines

                // If we hit a newline (and it's not just the trailing newline), increment count
                if (
                    NEW_LINE_CHARACTERS.includes(nextCharacter) &&
                    lines.length > 1
                ) {
                    lineCount++
                }
            }
            charsRead++
        }

        // Cleanup: remove leading newline if present
        if (NEW_LINE_CHARACTERS.includes(lines[0])) {
            lines = lines.substring(1)
        }

        // Return result based on requested encoding
        const finalBuffer = Buffer.from(lines, 'binary')
        return encoding === 'buffer'
            ? finalBuffer
            : finalBuffer.toString(encoding).split('\n')
    } catch (error) {
        throw error
    } finally {
        // Ensure the file is always closed
        if (fileHandle) {
            await fileHandle.close()
        }
    }
}
