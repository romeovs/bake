import { promises as fs } from "fs"
import path from "path"

import { once } from "./once"
import { CACHE } from "./config"
import { hash } from "./hash"
import { Manifest, Info } from "./manifest"

const read = once(async function (): Promise<Manifest> {
	const filename = path.resolve(CACHE, "manifest.json")
	const data = await fs.readFile(filename, "utf-8")
	return JSON.parse(data)
})

async function get(filename: string): Promise<Info[] | null> {
	const manifest = await read()
	const key = hash(filename)

	if (!(key in manifest)) {
		return null
	}

	return manifest[key]
}

export type PictureData = {
	key: string
	b: string
	s: string[]
}

export async function picture(filename: string): Promise<PictureData | null> {
	const info = await get(filename)
	if (!info || info.length === 0) {
		return null
	}

	const base = info[0].url.split("/").slice(0, -1).join("/").concat("/")

	return {
		key: info[0].key,
		b: base,
		s: info.map((info) => info.url.replace(base, "")),
	}
}
