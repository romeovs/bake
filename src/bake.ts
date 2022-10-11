import { createWriteStream, promises as fs } from "fs"
import path from "path"

import sharp from "sharp"
import Queue from "promise-queue"

import { IMAGES, CACHE, MANIFEST, sizes, formats } from "./config"
import { hash, contenthash } from "./hash"
import { upload } from "./upload"
import { filename } from "./filename"
import { exists } from "./exists"
import { matrix } from "./matrix"

export async function bake() {
	await initialize()
	const requests = await matrix()

	const queue = new Queue(5, 10000)
	const manifest = {}
	const promises = []

	for (const request of requests) {
		const promise = queue.add(async function () {
			console.log(`${request.file}\t\t${request.width}\t\t ${request.format}`)
			const url = await transform(request)

			manifest[request.key] = manifest[request.key] ?? []
			manifest[request.key].push({
				...request,
				file: undefined,
				url,
			})
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

async function transform(req: Request): Promise<void> {
	await build(req)
	const url = await upload(req)
	return url
}

async function build(req: Request) {
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
		img.on("end", () => resolve())
		img.on("error", (err: Error) => reject(err))
		img.pipe(out)
	})
}
