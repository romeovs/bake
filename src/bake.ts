import { promises as fs } from "fs"
import path from "path"

import Queue from "promise-queue"

import { CACHE } from "./config"
import { upload } from "./upload"
import { matrix } from "./matrix"
import { Manifest, Info } from "./manifest"
import { transform } from "./transform"

export async function bake() {
	await initialize()
	const requests = await matrix()

	const queue = new Queue(5, 10000)
	const manifest: Manifest = {}
	const promises = []

	for (const request of requests) {
		const promise = queue.add(async function () {
			console.log(`${request.file}\t\t${request.width}\t\t ${request.format}`)
			await transform(request)
			const url = await upload(request)

			const info: Info = {
				...request,
				url,
			}
			// @ts-expect-error
			delete info.file

			manifest[request.key] = manifest[request.key] ?? []
			manifest[request.key].push(info)
		})
		promises.push(promise)
	}

	await Promise.all(promises)

	const json = JSON.stringify(manifest, null, 2)
	await fs.writeFile(path.resolve(CACHE, "manifest.json"), json)
}

async function initialize() {
	await fs.mkdir(CACHE, { recursive: true })
}
