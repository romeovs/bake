import glob from "fast-glob"
import sharp from "sharp"

import { IMAGES, sizes, formats } from "./config"
import { hash, contenthash } from "./hash"

export type Size = {
	width: number
	height: number
}

export type Request = {
	file: string
	width: string
	height: string
	format: string
	key: string
}

export async function matrix(): Promise<Request> {
	const files = await glob(IMAGES)
	const res = []

	for (const file of files) {
		for (const size of sizes) {
			for (const format of formats) {
				const m = await meta(file)
				const key = hash(file)
				const h = await contenthash(file)
				const resized = resize(size, m)
				const uri = `/${key}.${resized.width}.${format}`

				const prev = res.find((r) => r.key === key && r.width === resized.width && r.format === format)
				if (!prev) {
					res.push({
						file,
						key,
						format,
						hash: h,
						...resized,
					})
				}
			}
		}
	}

	return res
}

async function meta(file: string): Size {
	const img = sharp(file)
	const m = await img.metadata()
	return { width: m.width ?? 1, height: m.height ?? 1 }
}

function resize(target: width, meta: Size): Size {
	if (meta.width < target) {
		return { ...meta }
	}

	return {
		width: target,
		height: Math.ceil((meta.height / meta.width) * target),
	}
}
