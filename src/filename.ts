import { Format } from "./format"
import { Request } from "./matrix"
import { SrcInfo } from "./manifest"

const base = 36

export function filename(req: Request) {
	return [
		req.key,
		req.hash,
		req.width.toString(base),
		req.height.toString(base),
		req.quality.toString(base),
		req.format,
	].join(".")
}

export function parse(url: string): SrcInfo {
	const parts = url.split("/")
	const name = parts[parts.length - 1]
	const items = name.split(".")

	return {
		url,
		key: items[0],
		hash: items[1],
		width: parseInt(items[2], base),
		height: parseInt(items[3], base),
		// quality: parseInt(items[4], base),
		format: items[5] as Format,
	}
}
