import "./dotenv"
import { picture } from "../src"

async function main() {
	const p = await picture("example/01/01.jpg")
	console.log(p)
}

main().catch(function (err) {
	console.error("FATAL", err)
	process.exit(1)
})
