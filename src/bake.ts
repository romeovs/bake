import { promises as fs } from "fs"
import path from "path"

import Queue from "promise-queue"

import { CACHE } from "./config"
import { upload, exists } from "./upload"
import { matrix, Request } from "./matrix"
import { Manifest, SrcInfo } from "./manifest"
import { transform } from "./transform"
import { log as console } from "./log"

export async function bake() {
	await initialize()

	console.log("Collecting images...")
	const requests = await matrix()
	const total = requests.length
	console.log(`Found ${total} image requests!`)

	const queue = new Queue(5, total)
	const manifest: Manifest = {}
	const promises = []

	console.log("Resizing and uploading...")
	const progress = console.progress(total)

	for (const request of requests) {
		const promise = queue.add(async function () {
			progress.step([request.format.padEnd(4), request.width.toString().padStart(5), request.file].join("  "))
			const info = await go(request)

			manifest[request.key] = manifest[request.key] ?? {
				width: request.originalWidth,
				height: request.originalHeight,
				srces: [],
			}

			manifest[request.key].srces.push(info)
		})
		promises.push(promise)
	}

	await Promise.all(promises)

	const json = JSON.stringify(manifest, null, 2)
	await fs.writeFile(path.resolve(CACHE, "manifest.json"), json)
}

async function go(request: Request): Promise<SrcInfo> {
	let url = await exists(request)
	if (!url) {
		await transform(request)
		url = await upload(request)
	}

	const info: SrcInfo = {
		...request,
		url,
	}

	// @ts-expect-error
	delete info.file

	return info
}

async function initialize() {
	await fs.mkdir(CACHE, { recursive: true })
}
