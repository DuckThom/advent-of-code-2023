import fs from "fs"
import { FileType } from "./get-input.ts"
import { getPuzzleInputPath } from "./get-puzzle-input-path.ts"

export async function downloadPuzzleInput(day: number): Promise<string> {
    if (!process.env.SESSION) {
        return ""
    }

    const input = await fetch(
        `https://adventofcode.com/2023/day/${day}/input`,
        {
            headers: {
                Cookie: `session=${process.env.SESSION}`,
            },
        },
    ).then(res => res.text())

    const path = getPuzzleInputPath(day, FileType.PUZZLE)

    console.log(`Saving downloaded puzzle input to ${path}`)
    fs.writeFileSync(path, input)

    return input
}
