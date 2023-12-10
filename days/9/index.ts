import assert from "assert"
import { FileType, getInput } from "../../utils/get-input.ts"

const DAY = 9

const testInput = await getInput(DAY, FileType.TEST_1)
const puzzleInput = await getInput(DAY, FileType.PUZZLE)

function calculate(input: string, flip: boolean): number {
    let result: number = 0

    input
        .split("\n")
        .filter(v => !!v)
        .forEach(line => {
            const tree: number[][] = [
                flip
                    ? line.split(" ").map(Number).reverse()
                    : line.split(" ").map(Number),
            ]

            let reverse: boolean = false
            let treeIndex: number = 0
            while (true) {
                if (tree[treeIndex].filter(v => !!v).length === 0) {
                    reverse = true
                    treeIndex--
                    continue
                }

                if (reverse && treeIndex === 0) {
                    result +=
                        tree[treeIndex][tree[treeIndex].length - 1] +
                        tree[treeIndex + 1][tree[treeIndex + 1].length - 1]

                    break
                } else if (reverse) {
                    tree[treeIndex].push(
                        tree[treeIndex][tree[treeIndex].length - 1] +
                            tree[treeIndex + 1][tree[treeIndex + 1].length - 1],
                    )

                    treeIndex--
                } else if (!reverse) {
                    const buffer: number[] = []

                    for (let i = 1; i < tree[treeIndex].length; i++) {
                        buffer.push(tree[treeIndex][i] - tree[treeIndex][i - 1])
                    }

                    tree.push(buffer)

                    treeIndex++
                }
            }
        })

    return result
}

function calculatePart1(input: string): number {
    return calculate(input, false)
}

function calculatePart2(input: string): number {
    return calculate(input, true)
}

const startTime = performance.now()

const part1TestResult = calculatePart1(testInput)
assert(
    part1TestResult === 114,
    `Failed to assert ${part1TestResult} equals 114`,
)

console.log(`[Part 1] Answer: ${calculatePart1(puzzleInput)}`)

const part2TestResult = calculatePart2(testInput)
assert(part2TestResult === 2, `Failed to assert ${part2TestResult} equals 2`)

console.log(`[Part 2] Answer: ${calculatePart2(puzzleInput)}`)

console.log(`Puzzle ${DAY} took: ${performance.now() - startTime}ms`)
