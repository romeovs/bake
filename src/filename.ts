import { Format } from "./format"
import { Request } from "./matrix"
import { Info } from "./manifest"

const base = 36

export function filename(req: Request) {
	return `${req.hash}.${req.width.toString(base)}.${req.height.toString(base)}.${req.format}`
}

export function parse(url: string): Info {
	const parts = url.split("/")
	const name = parts[parts.length - 1]
	const items = name.split(".")

	return {
		key: items[0],
		hash: items[1],
		url,
		width: parseInt(items[2], base),
		height: parseInt(items[3], base),
		format: items[4] as Format,
	}
}
