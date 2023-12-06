import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 4

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

type Card = {
    num: number
    winning: number[]
    count: number
}

function buildCardMap(input: string): Map<number, Card> {
    const cardMap = new Map<number, Card>()
    const cards: string[] = input.split("\n").filter(v => !!v)

    cards.forEach(card => {
        const [, num, numbers] = card.match(/Card\W+(\d+): (.*)/) ?? []
        const [winning, drawn] = numbers.split("|")

        const drawnNumbers = numbersToArray(drawn)
        const winningNumbers = numbersToArray(winning)

        cardMap.set(Number(num), {
            num: Number(num),
            winning: drawnNumbers.filter(v => winningNumbers.includes(v)),
            count: 1,
        })
    })

    return cardMap
}

function numbersToArray(input: string): number[] {
    const list: number[] = []

    for (const match of input.matchAll(/\d+/g)) {
        list.push(Number(match))
    }

    return list
}

function calculatePart1(input: string): number {
    let result: number = 0

    const cardMap = buildCardMap(input)

    cardMap.forEach(card => {
        let lineResult = 0b00000001

        if (card.winning.length) {
            result += lineResult << (card.winning.length - 1)
        }
    })

    return result
}

function calculatePart2(input: string): number {
    const cardMap = buildCardMap(input)

    let result = 0

    cardMap.forEach(card => {
        if (card.winning.length) {
            for (let i = 1; i <= card.winning.length; i++) {
                cardMap.get(card.num + i)!.count += card.count
            }
        }

        result += card.count
    })

    return result
}

const startTime = performance.now()

const part1TestResult = calculatePart1(testInput)
assert(part1TestResult === 13, `Failed to assert ${part1TestResult} equals 13`)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(part2TestResult === 30, `Failed to assert ${part2TestResult} equals 30`)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)

console.log(`Puzzle ${DAY} took: ${performance.now() - startTime}ms`)
