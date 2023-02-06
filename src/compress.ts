import { PictureInfo } from "./manifest"
import { parse } from "./filename"

export type CompressedPictureInfo = {
	w: number
	s: string[]
}

export function compress(picture: null): null
export function compress(picture: PictureInfo): CompressedPictureInfo
export function compress(picture: PictureInfo[]): CompressedPictureInfo[]
export function compress(
	picture: null | PictureInfo | PictureInfo[],
): CompressedPictureInfo | CompressedPictureInfo[] | null {
	if (Array.isArray(picture)) {
		return picture.map((x) => compress(x))
	}

	if (!picture) {
		return null
	}

	return {
		w: picture.width,
		s: picture.srces.map((x) => x.url),
	}
}

export function decompress(compressed: null): null
export function decompress(compressed: PictureInfo): PictureInfo
export function decompress(compressed: PictureInfo[]): PictureInfo[]
export function decompress(compressed: CompressedPictureInfo): PictureInfo
export function decompress(compressed: CompressedPictureInfo[]): PictureInfo[]
export function decompress(
	compressed: null | PictureInfo | CompressedPictureInfo | (CompressedPictureInfo | PictureInfo)[],
): PictureInfo | PictureInfo[] | null {
	if (Array.isArray(compressed)) {
		return compressed.map((x) => decompress(x as CompressedPictureInfo))
	}

	if (!compressed) {
		return null
	}

	if ("width" in compressed && "srces" in compressed) {
		return compressed
	}

	const srces = compressed.s.map(parse)

	const ratio = srces[0].width / srces[0].height
	const width = compressed.w
	const height = width / ratio

	return {
		width: compressed.w,
		height,
		srces,
	}
}
