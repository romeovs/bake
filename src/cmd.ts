import process from "process"

import "./dotenv"
import { bake } from "./bake"
import { check } from "./check"

async function main() {
	const command = process.argv[2] ?? ""

	switch (command) {
		case "":
			await bake()
			return
		case "check":
			await check()
			return
	}
}

main().catch(function (err) {
	console.error("FATAL", err)
	process.exit(1)
})
