import { createWriteStream, promises as fs } from "fs"
import path from "path"

import sharp from "sharp"
import Queue from "promise-queue"

import { CACHE } from "./config"
import { upload } from "./upload"
import { filename } from "./filename"
import { exists } from "./exists"
import { matrix, Request } from "./matrix"
import { Manifest, Info } from "./manifest"

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

async function transform(req: Request) {
	const fname = filename(req)
	const dest = path.resolve(CACHE, fname)

	if (await exists(dest)) {
		return
	}

	const img = sharp(req.file)

	img.resize({ width: req.width })

	if (req.format === "jpeg") {
		img.jpeg({ progressive: true, quality: 80 })
	}

	if (req.format === "webp") {
		img.webp({ quality: 80, alphaQuality: 50 })
	}

	if (req.format === "avif") {
		img.avif({ quality: 50, effort: 8 })
	}

	const out = createWriteStream(dest)

	await new Promise(function (resolve, reject) {
		img.on("end", () => resolve(undefined))
		img.on("error", (err: Error) => reject(err))
		img.pipe(out)
	})
}
