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

export async function get(filename: string): Promise<Info[] | null> {
	const manifest = await read()
	const key = hash(filename)

	if (!(key in manifest)) {
		return null
	}

	return manifest[key]
}
