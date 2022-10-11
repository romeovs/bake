import process from "process"

async function main() {
	const command = process.argv[2]

	switch (command) {
		case "serve":
			return
		case "bake":
			return
	}

	throw new Error(`Unknown command \`${command}\``)
}

main().catch(function (err) {
	console.error("FATAL", err)
	process.exit(1)
})
