import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 6

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

type Race = {
    time: number
    distance: number
}

function buildRaceList(input: string, asSingleRace: boolean): Race[] {
    const split = input.split("\n").filter(v => !!v)
    const races: Race[] = []

    const times = split[0]
        .replace("Time:", "")
        .trim()
        .replaceAll(/\s+/g, asSingleRace ? "" : " ")
        .split(" ")

    split[1]
        .replace("Distance:", "")
        .trim()
        .replaceAll(/\s+/g, asSingleRace ? "" : " ")
        .split(" ")
        .forEach((v, index) => {
            races.push({
                time: Number(times[index]),
                distance: Number(v),
            })
        })

    return races
}

function processRacesQuadratic(races: Race[]): number {
    let result = 0

    races.forEach(race => {
        let start = Math.ceil(
            (race.time -
                Math.pow(race.time * race.time - 4 * race.distance - 1, 0.5)) /
                2.0,
        )
        let end = Math.floor(
            (race.time +
                Math.pow(race.time * race.time - 4 * race.distance - 1, 0.5)) /
                2.0,
        )

        switch (result) {
            case 0:
                result = end - start + 1
                break
            default:
                result *= end - start + 1
        }
    })

    return result
}

function processRaces(races: Race[]): number {
    let result = 0

    races.forEach(race => {
        let start = 0
        let end = 0

        let speed = Math.floor(Math.log(race.time))
        let inverse = false

        while (end === 0) {
            if ((race.time - speed) * speed > race.distance) {
                switch (true) {
                    case inverse:
                        end = speed + 1
                        break
                    default:
                        start = speed
                        inverse = true
                        speed = race.time
                }
            }

            switch (true) {
                case inverse:
                    speed--
                    break
                default:
                    speed++
            }
        }

        switch (result) {
            case 0:
                result = end - start
                break
            default:
                result *= end - start
        }
    })

    return result
}

function calculatePart1(input: string): number {
    const races = buildRaceList(input, false)

    return processRacesQuadratic(races)
}

function calculatePart2(input: string): number {
    const races = buildRaceList(input, true)

    return processRacesQuadratic(races)
}

const startTime = performance.now()

const part1TestResult = calculatePart1(testInput)
assert(
    part1TestResult === 288,
    `Failed to assert ${part1TestResult} equals 288`,
)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(
    part2TestResult === 71503,
    `Failed to assert ${part2TestResult} equals 71503`,
)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)

console.log(`Puzzle ${DAY} took: ${performance.now() - startTime}ms`)
