import glob from "fast-glob"
import sharp from "sharp"

import { IMAGES, sizes, formats } from "./config"
import { Format } from "./format"
import { contenthash } from "./hash"
import { encode } from "./key"

export type Size = {
	width: number
	height: number
}

export type Request = {
	file: string
	width: number
	height: number
	format: Format
	key: string
}

export async function matrix(): Promise<Request> {
	const files = await glob(IMAGES)
	const res: Request[] = []

	for (const file of files) {
		for (const size of sizes) {
			for (const format of formats) {
				const m = await meta(file)
				const key = encode(file)
				const hash = await contenthash(file)
				const resized = resize(size, m)

				const prev = res.find((r) => r.key === key && r.width === resized.width && r.format === format)
				if (!prev) {
					res.push({
						file,
						key,
						format,
						hash,
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
