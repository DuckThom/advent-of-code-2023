import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 8

const test1Input = await getInput(DAY, FileType.TEST_1)
const test2Input = await getInput(DAY, FileType.TEST_2)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

type Mapping = {
    pattern: number[]
    mapping: Array<[number, number]>
}

function parseInput(input: string): Mapping {
    const split = input.split("\n\n")
    const [pattern, mapping] = split

    const mappingArray: Array<[number, number]> = []

    const patternArray: number[] = pattern
        .replaceAll("L", "0")
        .replaceAll("R", "1")
        .split("")
        .map(Number)

    mapping.split("\n").forEach(line => {
        if (!line) return

        const match =
            line.match(/([0-9A-Z]{3}) = \(([0-9A-Z]{3}), ([0-9A-Z]{3})\)/) ?? []

        return (mappingArray[parseInt(match[1], 36)] = [
            parseInt(match[2], 36),
            parseInt(match[3], 36),
        ])
    })

    return {
        pattern: patternArray,
        mapping: mappingArray,
    }
}

function calculatePart1(input: string): number {
    let result: number = 0
    let location = parseInt("AAA", 36)
    let patternStep = 0

    const mapping = parseInput(input)

    while (location !== parseInt("ZZZ", 36)) {
        const index = mapping.pattern[patternStep]

        location = mapping.mapping[location][index]

        if (patternStep === mapping.pattern.length - 1) {
            patternStep = 0
        } else {
            patternStep++
        }

        result++
    }

    return result
}

function findLCM(a: number, b: number): number {
    let lar = Math.max(a, b)
    let small = Math.min(a, b)

    for (let i = lar; ; i += lar) {
        if (i % small == 0) return i
    }
}

function calculatePart2(input: string): number {
    const mapping = parseInput(input)
    const loops: number[] = []
    const locations: number[] = []

    mapping.mapping.forEach((map, node) => {
        if (node % 36 === 10) {
            locations.push(node)
        }
    })

    for (let i = 0; i < locations.length; i++) {
        let patternStep = 0
        let counter = 0

        while (locations[i] % 36 !== 35) {
            locations[i] =
                mapping.mapping[locations[i]][mapping.pattern[patternStep]]

            if (patternStep === mapping.pattern.length - 1) {
                patternStep = 0
            } else {
                patternStep++
            }

            counter++
        }

        loops.push(counter)
    }

    return loops.reduce(findLCM)
}

const startTime = performance.now()

const part1TestResult = calculatePart1(test1Input)
assert(part1TestResult === 2, `Failed to assert ${part1TestResult} equals 2`)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(test2Input)
assert(part2TestResult === 6, `Failed to assert ${part2TestResult} equals 6`)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)

console.log(`Puzzle ${DAY} took: ${performance.now() - startTime}ms`)
