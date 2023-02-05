import { promises as fs } from "fs"
import path from "path"

import { once } from "./once"
import { hash } from "./hash"
import { Manifest, PictureInfo } from "./manifest"
import { env } from "./env"

export { compress, decompress } from "./compress"
export { parse } from "./filename"
export type { PictureInfo, Manifest }

const read = once(async function (): Promise<Manifest> {
	const filename = path.resolve(env("BAKE_CACHE", ".bake"), "manifest.json")
	const data = await fs.readFile(filename, "utf-8")
	return JSON.parse(data)
})

async function get(filename: string): Promise<PictureInfo | null> {
	const manifest = await read()
	const key = hash(filename)

	if (!(key in manifest)) {
		return null
	}

	return manifest[key]
}

export async function picture(filename: string): Promise<PictureInfo | null> {
	const info = await get(filename)
	if (!info) {
		return null
	}

	return info
}
