import { createWriteStream } from "fs"
import sharp from "sharp"
import path from "path"

import { Request } from "./matrix"
import { filename } from "./filename"
import { exists } from "./exists"
import { CACHE, QUALITY } from "./config"

export async function transform(req: Request): Promise<void> {
	const fname = filename(req)
	const dest = path.resolve(CACHE, "im", fname)

	if (await exists(dest)) {
		return
	}

	const img = sharp(req.file, { animated: true })

	img.resize({ width: req.width })

	if (!req.lossless) {
		if (req.format === "jpeg") {
			img.jpeg({ progressive: true, quality: QUALITY })
		}

		if (req.format === "webp") {
			img.webp({ quality: QUALITY, alphaQuality: QUALITY })
		}

		if (req.format === "avif") {
			img.avif({ quality: QUALITY - 15, effort: 8 })
		}

		if (req.format === "png") {
			img.png({ quality: 100 })
		}

		if (req.format === "gif") {
			img.gif()
		}
	}

	const out = createWriteStream(dest)

	await new Promise(function (resolve, reject) {
		img.on("end", () => resolve(undefined))
		img.on("error", (err: Error) => reject(err))
		img.pipe(out)
	})
}
