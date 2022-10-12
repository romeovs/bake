import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

import { once } from "./once"
import { CACHE } from "./config"
import { hash } from "./hash"
import { Manifest, Info } from "./manifest"
import { parse } from "./filename"
import { Format } from "./format"

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

export type Picture = {
	key: string
	b: string
	s: string[]
}

export async function picture(filename: string): Promise<Picture | null> {
	const info = await get(filename)
	if (!info || info.length === 0) {
		return null
	}

	const base = info[0].url.split("/").slice(0, 1).join("/")

	return {
		key: info[0].key,
		b: base,
		s: info.map((info) => info.url.replace(base, "")),
	}
}

type PictureProps = Picture & { sizes: string }

export function Picture(props: PictureProps): React.ReactNode {
	const { b, s, sizes, ...rest } = props
	const info = React.useMemo(() => s.map(parse), [s])

	return (
		<picture {...rest}>
			<Source format="avif" info={info} sizes={sizes} />
			<Source format="webp" info={info} sizes={sizes} />
			<Source format="jpeg" info={info} sizes={sizes} />
		</picture>
	)
}

type SourceProps = {
	format: Format
	info: Info[]
	sizes: string
}

const Source = React.memo(function Source(props: SourceProps) {
	const { format, info, sizes } = props

	const ims = info.filter((x) => x.format === format).sort(byWidth)
	const src = ims[0].url
	const srcSet = ims.map((x) => `${x.url} ${x.width}w`).join(", ")

	if (ims.length === 0) {
		return null
	}

	if (format === "jpeg") {
		return <img src={src} srcSet={srcSet} sizes={sizes} />
	}

	return <source type={`image/${format}`} src={src} srcSet={srcSet} sizes={sizes} />
})

function byWidth(a: Info, b: Info): number {
	return a.width - b.width
}
