import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 2

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

type RGB = {
    red: number
    green: number
    blue: number
}

const GAME_CUBES = {
    red: 12,
    green: 13,
    blue: 14,
}

function parseRGB(rgb: string): RGB {
    const [, redMatch] = rgb.match(/(\d+) red/) ?? []
    const [, greenMatch] = rgb.match(/(\d+) green/) ?? []
    const [, blueMatch] = rgb.match(/(\d+) blue/) ?? []

    const red = redMatch ? Number(redMatch.replace(" red", "")) : 0
    const green = greenMatch ? Number(greenMatch.replace(" green", "")) : 0
    const blue = blueMatch ? Number(blueMatch.replace(" blue", "")) : 0

    return {
        red,
        green,
        blue,
    }
}

function getMaxRGB(game: string): RGB {
    let maxRed = 0
    let maxGreen = 0
    let maxBlue = 0

    for (const grabbedCubes of game.split(";")) {
        const rgb = parseRGB(grabbedCubes)

        if (rgb.red > maxRed) {
            maxRed = rgb.red
        }

        if (rgb.green > maxGreen) {
            maxGreen = rgb.green
        }

        if (rgb.blue > maxBlue) {
            maxBlue = rgb.blue
        }
    }

    return {
        red: maxRed,
        green: maxGreen,
        blue: maxBlue,
    }
}

function isGamePossible(game: string): boolean {
    for (const grabbedCubes of game.split(";")) {
        const rgb = parseRGB(grabbedCubes)

        if (
            rgb.red > GAME_CUBES.red ||
            rgb.blue > GAME_CUBES.blue ||
            rgb.green > GAME_CUBES.green
        ) {
            return false
        }
    }

    return true
}

function calculatePart1(input: string): number {
    let result: number = 0

    input
        .split(`\n`)
        .filter(v => !!v)
        .forEach(line => {
            const [, gameId, game] = line.match(/Game (\d+): (.*)/) ?? []

            if (isGamePossible(game)) {
                result += Number(gameId)
            }
        })

    return result
}

function calculatePart2(input: string): number {
    let result: number = 0

    input
        .split(`\n`)
        .filter(v => !!v)
        .forEach(line => {
            const [, , game] = line.match(/Game (\d+): (.*)/) ?? []
            const rgb = getMaxRGB(game)

            result += rgb.red * rgb.green * rgb.blue
        })

    return result
}

const part1TestResult = calculatePart1(testInput)
assert(part1TestResult === 8, `Failed to assert ${part1TestResult} equals 8`)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(
    part2TestResult === 2286,
    `Failed to assert ${part2TestResult} equals 2286`,
)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)
