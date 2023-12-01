import assert from "assert"
import { FileType, getInput } from "../utils/get-input.ts"

const DAY = 1

const part1TestInput = await getInput(DAY, FileType.TEST_1)
const part2TestInput = await getInput(DAY, FileType.TEST_2)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

const NumberMap: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
}

const numRegex = /[0-9]/

function transformNumbers(input: string): string {
    let newInput = input

    Object.keys(NumberMap).forEach(key => {
        const firstChar = key.substring(0, 1)
        const lastChar = key.substring(key.length - 1, key.length)

        newInput = newInput.replaceAll(
            key,
            `${firstChar}${NumberMap[key]}${lastChar}`,
        )
    })

    return newInput
}

function calculate(input: string, transform: boolean = false): number {
    let result: number = 0

    input
        .split("\n")
        .filter(line => !!line)
        .forEach(line => {
            let firstNumber: string | undefined = undefined,
                lastNumber: string | undefined = undefined

            const chars = (transform ? transformNumbers(line) : line)
                .trimEnd()
                .split("")
                .filter(v => numRegex.test(v))
            chars.forEach(char => {
                if (firstNumber !== undefined) return
                if (numRegex.test(char)) firstNumber = char
            })

            chars.reverse()

            chars.forEach(char => {
                if (lastNumber !== undefined) return
                if (numRegex.test(char)) lastNumber = char
            })

            result += Number(`${firstNumber}${lastNumber}`)
        })

    return result
}

const part1TestResult = calculate(part1TestInput)
assert(
    part1TestResult === 142,
    `Failed to assert ${part1TestResult} equals 142`,
)

console.log(`[Part 1] Answer: ${calculate(puzzleInput)}`)

const part2TestResult = calculate(part2TestInput, true)
assert(
    part2TestResult === 281,
    `Failed to assert ${part2TestResult} equals 281`,
)

console.log(`[Part 2] Answer: ${calculate(puzzleInput, true)}`)
