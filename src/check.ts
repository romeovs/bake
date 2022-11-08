import Queue from "promise-queue"

import { matrix } from "./matrix"
import { exists } from "./upload"

export async function check() {
	const queue = new Queue(5, 10000)
	console.log("Collecting images...")
	const requests = await matrix()
	const total = requests.length
	console.log(`Found ${total} image requests!`)
	const promises = []

	console.log("Checking S3...")

	let idx = 0
	for (const request of requests) {
		const promise = queue.add(async function () {
			const ok = await exists(request)
			idx++

			console.log(
				`${idx.toString().padStart(5, " ")}/${total} ${request.file}\t\t${request.width}\t\t ${request.format} ${
					ok ? "OK" : "NOT OK"
				}`,
			)

			return {
				...request,
				ok,
			}
		})
		promises.push(promise)
	}

	const checked = await Promise.all(promises)
	if (checked.some((x) => !x.ok)) {
		console.error("Not all images have been uploaded to S3")
		process.exit(1)
		return
	}

	console.log("OK!")
}
