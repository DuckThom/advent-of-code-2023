import fs from "fs"
import { configDotenv } from "dotenv"
import { resolve } from "path"

configDotenv()

if (!process.env.SESSION) {
    console.log("No session cookie detected, auto-download will be disabled!")
}

const days = fs.readdirSync(resolve(import.meta.dir, "days"))

days.sort()

const startTime = performance.now()

for (const day of days) {
    console.log(`====== DAY ${day} ======`)

    await import(`./days/${day}/index.ts`)

    console.log("")
}

console.log(`All puzzles took: ${performance.now() - startTime}ms`)
