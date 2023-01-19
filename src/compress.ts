import { PictureInfo } from "./manifest"
import { parse } from "./filename"

export type CompressedPictureInfo = {
	w: number
	s: string[]
}

export function compress(picture: PictureInfo): CompressedPictureInfo
export function compress(picture: PictureInfo[]): CompressedPictureInfo[]
export function compress(picture: PictureInfo | PictureInfo[]): CompressedPictureInfo | CompressedPictureInfo[] {
	if (Array.isArray(picture)) {
		return picture.map((x) => compress(x))
	}

	return {
		w: picture.width,
		s: picture.srces.map((x) => x.url),
	}
}

export function decompress(compressed: CompressedPictureInfo): PictureInfo
export function decompress(compressed: CompressedPictureInfo[]): PictureInfo[]
export function decompress(compressed: CompressedPictureInfo | CompressedPictureInfo[]): PictureInfo | PictureInfo[] {
	if (Array.isArray(compressed)) {
		return compressed.map((x) => decompress(x))
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
