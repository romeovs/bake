import Queue from "promise-queue"

import { matrix } from "./matrix"
import { exists } from "./upload"

export async function check() {
	const queue = new Queue(5, 10000)
	console.log("Collecting images...")
	const requests = await matrix()
	const promises = []

	console.log("Checking S3...")
	for (const request of requests) {
		const promise = queue.add(async function () {
			const ok = await exists(request)
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
