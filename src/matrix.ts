import glob from "fast-glob"
import sharp from "sharp"

import { IMAGES, sizes, formats } from "./config"
import { Format, isFormat } from "./format"
import { contenthash } from "./hash"
import { encode } from "./key"

export type Request = {
	file: string
	hash: string
	originalWidth: number
	originalHeight: number
	width: number
	height: number
	format: Format
	key: string
	lossless: boolean
}

export async function matrix(): Promise<Request[]> {
	const files = await glob(IMAGES.split(","))
	const res: Request[] = []

	for (const file of files) {
		const m = await meta(file)
		const key = encode(file)
		const hash = await contenthash(file)

		if (!isFormat(m.format)) {
			throw new Error(`Unsuppported format: ${m.format}`)
		}

		for (const size of sizes) {
			const resized = resize(size, m)

			if (m.animated || m.format === "png") {
				// do not convert animated or lossless images
				res.push({
					file,
					key,
					format: m.format,
					hash,
					originalWidth: m.width,
					originalHeight: m.height,
					...resized,
					lossless: true,
				})

				continue
			}

			for (const format of formats) {
				const prev = res.find((r) => r.key === key && r.width === resized.width && r.format === format)
				if (!prev) {
					res.push({
						file,
						key,
						format,
						hash,
						originalWidth: m.width,
						originalHeight: m.height,
						...resized,
						lossless: false,
					})
				}
			}
		}
	}

	return res
}

export type Metadata = {
	width: number
	height: number
	animated: boolean
	lossless: boolean
	format: string
}

async function meta(file: string): Promise<Metadata> {
	const img = sharp(file)
	const m = await img.metadata()
	return {
		width: m.width ?? 1,
		height: m.height ?? 1,
		animated: (m.pages ?? 1) > 1,
		lossless: m.format === "png",
		format: m.format ?? "unknown",
	}
}

type Dimensions = {
	width: number
	height: number
}

function resize(target: number, meta: Dimensions): Dimensions {
	if (meta.width < target) {
		return { ...meta }
	}

	return {
		width: target,
		height: Math.ceil((meta.height / meta.width) * target),
	}
}
