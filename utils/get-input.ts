import fs from "fs"
import { getPuzzleInputPath } from "./get-puzzle-input-path.ts"
import { downloadPuzzleInput } from "./download-puzzle-input.ts"

export enum FileType {
    TEST_1 = "part1-test-input",
    TEST_2 = "part2-test-input",
    PUZZLE = "puzzle-input",
}

export async function getInput(day: number, type: FileType): Promise<string> {
    try {
        return fs
            .readFileSync(getPuzzleInputPath(day, type), {
                encoding: "ascii",
            })
            .toString()
    } catch (e) {
        if (type === FileType.PUZZLE) {
            if (process.env.SESSION) {
                return await downloadPuzzleInput(day)
            }

            console.error(`Missing puzzle input for day ${day}!`)

            return ""
        } else {
            throw e
        }
    }
}
