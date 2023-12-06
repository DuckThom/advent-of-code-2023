import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 5

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

function extractNumbers(input: string): number[] {
    return input
        .replaceAll(/\s+/g, " ")
        .trim()
        .split(" ")
        .map(v => Number(v))
}

type NumberShiftMap = Map<string, NumberShift[]>
type NumberShift = number[]

function buildMaps(input: string): [number[], NumberShiftMap] {
    const [, seedsMatch] = input.match(/seeds: (.*)/) ?? []
    const seeds = extractNumbers(seedsMatch)

    const maps: NumberShiftMap = new Map<string, NumberShift[]>()

    const mapBuffer: {
        name: string | null
        numbers: NumberShift[]
    } = {
        name: null,
        numbers: [],
    }

    input.split("\n").forEach(line => {
        if (/(.*) map:/.test(line)) {
            mapBuffer.name = line.replace(" map:", "")

            return
        }

        if (!line.trim() && mapBuffer.name) {
            maps.set(mapBuffer.name, mapBuffer.numbers)

            mapBuffer.name = null
            mapBuffer.numbers = []

            return
        }

        if (mapBuffer.name) {
            mapBuffer.numbers.push(extractNumbers(line))
        }
    })

    return [seeds, maps]
}

function convertNumber(num: number, convertingTable: NumberShift[]): number {
    const table = convertingTable.find(table => {
        return num >= table[1] && num < table[1] + table[2]
    })

    if (table) {
        const offset = table[0] - table[1]

        return num + offset
    }

    return num
}

function convertNumberInv(num: number, convertingTable: NumberShift[]): number {
    const table = convertingTable.find(table => {
        return num >= table[0] && num < table[0] + table[2]
    })

    if (table) {
        const offset = table[0] - table[1]

        return num - offset
    }

    return num
}

function findLowestLocation(seeds: number[], maps: NumberShiftMap): number {
    const seedLocations: number[] = []

    seeds.forEach(seed => {
        const soil = convertNumber(seed, maps.get("seed-to-soil")!)
        const fertilizer = convertNumber(soil, maps.get("soil-to-fertilizer")!)
        const water = convertNumber(
            fertilizer,
            maps.get("fertilizer-to-water")!,
        )
        const light = convertNumber(water, maps.get("water-to-light")!)
        const temp = convertNumber(light, maps.get("light-to-temperature")!)
        const humidity = convertNumber(
            temp,
            maps.get("temperature-to-humidity")!,
        )
        const location = convertNumber(
            humidity,
            maps.get("humidity-to-location")!,
        )

        seedLocations.push(location)
    })

    return Math.min(...seedLocations)
}

function findSeedForLocation(location: number, maps: NumberShiftMap): number {
    const humidity = convertNumberInv(
        location,
        maps.get("humidity-to-location")!,
    )
    const temp = convertNumberInv(
        humidity,
        maps.get("temperature-to-humidity")!,
    )
    const light = convertNumberInv(temp, maps.get("light-to-temperature")!)
    const water = convertNumberInv(light, maps.get("water-to-light")!)
    const fertilizer = convertNumberInv(water, maps.get("fertilizer-to-water")!)
    const soil = convertNumberInv(fertilizer, maps.get("soil-to-fertilizer")!)

    return convertNumberInv(soil, maps.get("seed-to-soil")!)
}

function calculatePart1(input: string): number {
    const [seeds, maps] = buildMaps(input)

    return findLowestLocation(seeds, maps)
}

function calculatePart2(input: string): number {
    const [seedRanges, maps] = buildMaps(input)

    let minSeed = Number.MAX_SAFE_INTEGER
    let maxSeed = Number.MIN_SAFE_INTEGER

    while (seedRanges.length > 0) {
        const seed = seedRanges.shift()!
        const range = seedRanges.shift()!

        if (seed < minSeed) {
            minSeed = seed
        }

        if (seed + range > maxSeed) {
            maxSeed = seed + range
        }
    }

    for (let i = 1; i < 1_000_000_000; i++) {
        const seed = findSeedForLocation(i, maps)

        if (seed >= minSeed && seed < maxSeed) {
            return i
        }
    }

    throw new Error("Seed not found")
}

const startTime = performance.now()

const part1TestResult = calculatePart1(testInput)
assert(part1TestResult === 35, `Failed to assert ${part1TestResult} equals 35`)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(part2TestResult === 46, `Failed to assert ${part2TestResult} equals 46`)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)

console.log(`Puzzle ${DAY} took: ${performance.now() - startTime}ms`)
