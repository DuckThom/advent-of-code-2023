import { dirname, resolve } from "path"
import { FileType } from "./get-input.ts"

export function getPuzzleInputPath(day: number, type: FileType): string {
    return resolve(
        dirname(import.meta.path),
        "..",
        `day-${day}`,
        type.toString(),
    )
}
