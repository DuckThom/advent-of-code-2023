import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 7

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

enum HandType {
    HIGH_CARD,
    ONE_PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    FIVE_OF_A_KIND,
}

type Hand = {
    cards: number[]
    type: HandType
}

type Game = {
    multiplier: number
    hand: Hand
}

function determineHandType(cards: number[], withJokers: boolean): HandType {
    let type: HandType = HandType.HIGH_CARD

    if (withJokers && cards.join("") == "11111") {
        return HandType.FIVE_OF_A_KIND
    }

    const jokers = withJokers ? cards.filter(v => v === 1).length : 0

    const counts = (withJokers ? cards.filter(v => v !== 1) : cards).reduce(
        (prev: number[], cur) => {
            prev[cur] = (prev[cur] || 0) + 1
            return prev
        },
        [],
    )

    if (withJokers) {
        const dominantCard = counts.indexOf(
            Math.max(...counts.filter(v => !!v)),
        )

        counts[dominantCard] += jokers
    }

    switch (true) {
        case counts.indexOf(5) !== -1:
            type = HandType.FIVE_OF_A_KIND
            break
        case counts.indexOf(4) !== -1:
            type = HandType.FOUR_OF_A_KIND
            break
        case counts.indexOf(3) !== -1 && counts.indexOf(2) !== -1:
            type = HandType.FULL_HOUSE
            break
        case counts.indexOf(3) !== -1 && counts.indexOf(2) === -1:
            type = HandType.THREE_OF_A_KIND
            break
        case counts.filter(v => v === 2).length === 2:
            type = HandType.TWO_PAIR
            break
        case counts.filter(v => v === 2).length === 1:
            type = HandType.ONE_PAIR
            break
    }

    return type
}

function parseInput(input: string, withJokers: boolean): Game[] {
    // T = 10 = A
    // J = 11 = B || withJokers = 1
    // Q = 12 = C
    // K = 13 = D
    // A = 14 = E

    return (
        input
            // Replace letters with their hex counterparts
            .replaceAll("A", "E")
            .replaceAll("K", "D")
            .replaceAll("Q", "C")
            .replaceAll("J", withJokers ? "1" : "B")
            .replaceAll("T", "A")
            .split("\n")
            .filter(v => !!v)
            .map((line): Game => {
                const [hand, multiplier] = line.split(" ")
                const cards = hand.split("").map(v => parseInt(v, 16))

                const type = determineHandType(cards, withJokers)

                return {
                    hand: {
                        cards,
                        type,
                    },
                    multiplier: Number(multiplier),
                }
            })
    )
}

function rankGames(games: Game[]): Game[] {
    return games.sort((a, b) => {
        if (a.hand.type !== b.hand.type) {
            return Math.sign(a.hand.type - b.hand.type)
        }

        for (let i = 0; i < 5; i++) {
            if (a.hand.cards[i] !== b.hand.cards[i]) {
                return Math.sign(a.hand.cards[i] - b.hand.cards[i])
            }
        }

        return 0
    })
}

function calculatePart1(input: string): number {
    let result: number = 0
    const games = parseInput(input, false)

    rankGames(games)

    games.forEach((game, rank) => {
        result += (rank + 1) * game.multiplier
    })

    return result
}

function calculatePart2(input: string): number {
    let result: number = 0
    const games = parseInput(input, true)

    rankGames(games)

    games.forEach((game, rank) => {
        result += (rank + 1) * game.multiplier
    })

    return result
}

const startTime = performance.now()

const part1TestResult = calculatePart1(testInput)
assert(
    part1TestResult === 6440,
    `Failed to assert ${part1TestResult} equals 6440`,
)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(
    part2TestResult === 5905,
    `Failed to assert ${part2TestResult} equals 5905`,
)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)

console.log(`Puzzle ${DAY} took: ${performance.now() - startTime}ms`)
