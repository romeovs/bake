import Queue from "promise-queue"

import { matrix } from "./matrix"
import { exists } from "./upload"
import { log as console } from "./log"

export async function check() {
	console.log("Collecting images...")
	const requests = await matrix()
	const total = requests.length
	console.log(`Found ${total} image requests!`)
	const promises = []
	const queue = new Queue(5, total)

	console.log("Checking S3...")
	const progress = console.progress(total)

	for (const request of requests) {
		const promise = queue.add(async function () {
			const ok = await exists(request)

			progress.step(
				[request.format.padEnd(4), request.width.toString().padStart(5), ok ? "    OK" : "NOT OK", request.key, request.file].join(
					"  ",
				),
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
