import fs from "fs"
import { configDotenv } from "dotenv"

configDotenv()

if (!process.env.SESSION) {
    console.log("No session cookie detected, auto-download will be disabled!")
}

const days = fs
    .readdirSync(import.meta.dir)
    .filter(file => file.startsWith("day-"))
    .map(day => day.replace("day-", ""))

days.sort()

for (const day of days) {
    console.log(`====== DAY ${day} ======`)

    await import(`./day-${day}/index.ts`)

    console.log("")
}
