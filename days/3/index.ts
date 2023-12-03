import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 3

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

type Point = [number, number] // row, index

type Matrix = string[][]

type DetectedNumber = {
    value: number
    points: Point[]
}

function buildNumberList(matrix: Matrix): DetectedNumber[] {
    const numberList: DetectedNumber[] = []

    matrix.forEach((line, row) => {
        let numberBuffer: number[] = []
        let pointBuffer: Point[] = []

        line.forEach((char, index) => {
            if (/[0-9]/.test(char)) {
                if (numberBuffer.length === 0 && index !== 0) {
                    if (row !== 0) pointBuffer.push([row - 1, index - 1])
                    pointBuffer.push([row, index - 1])
                    pointBuffer.push([row + 1, index - 1])
                }

                numberBuffer.push(Number(char))

                if (row !== 0) pointBuffer.push([row - 1, index])
                pointBuffer.push([row + 1, index])
            } else if (numberBuffer.length > 0) {
                if (row !== 0) pointBuffer.push([row - 1, index])
                pointBuffer.push([row, index])
                pointBuffer.push([row + 1, index])

                numberList.push({
                    value: Number(numberBuffer.join("")),
                    points: [...pointBuffer],
                })

                numberBuffer = []
                pointBuffer = []
            }
        })

        if (numberBuffer.length > 0) {
            numberList.push({
                value: Number(numberBuffer.join("")),
                points: [...pointBuffer],
            })

            numberBuffer = []
            pointBuffer = []
        }
    })

    return numberList
}

function buildSymbolList(matrix: Matrix): Point[] {
    const symbolList: Point[] = []

    matrix.forEach((line, row) => {
        line.forEach((char, index) => {
            if (/[^0-9.]/.test(char)) {
                symbolList.push([row, index])
            }
        })
    })

    return symbolList
}

function convertInputToMatrix(input: string): Matrix {
    return input
        .split("\n")
        .filter(v => !!v)
        .map((line, row) => {
            return line.trimEnd().split("")
        })
}

function hasAdjacentSymbol(
    symbolList: Point[],
    detectedNumber: DetectedNumber,
) {
    return detectedNumber.points.some(point =>
        symbolList.find(
            symbolPoint =>
                symbolPoint[0] === point[0] && symbolPoint[1] === point[1],
        ),
    )
}

function calculatePart1(input: string): number {
    let result: number = 0

    const matrix = convertInputToMatrix(input)

    const numberList = buildNumberList(matrix)
    const symbolList: Point[] = buildSymbolList(matrix)

    numberList.forEach(item => {
        if (hasAdjacentSymbol(symbolList, item)) {
            result += item.value
        }
    })

    return result
}

function calculatePart2(input: string): number {
    let result: number = 0

    const matrix = convertInputToMatrix(input)

    const numberList = buildNumberList(matrix)
    const symbolList: Point[] = buildSymbolList(matrix)

    symbolList.forEach(item => {
        const adjacentNumbers = numberList.filter(num =>
            num.points.some(
                point => item[0] === point[0] && item[1] === point[1],
            ),
        )

        if (adjacentNumbers.length === 2) {
            result += adjacentNumbers[0].value * adjacentNumbers[1].value
        }
    })

    return result
}

const part1TestResult = calculatePart1(testInput)
assert(
    part1TestResult === 4361,
    `Failed to assert ${part1TestResult} equals 4361`,
)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(
    part2TestResult === 467835,
    `Failed to assert ${part2TestResult} equals 467835`,
)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)
