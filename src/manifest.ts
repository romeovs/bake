import { Format } from "./format"

export type SrcInfo = {
	key: string
	hash: string
	url: string
	cdn: string | undefined
	format: Format
	width: number
	height: number
	quality: number
}

export type PictureInfo = {
	width: number
	height: number
	srces: SrcInfo[]
}

export type Manifest = {
	[key: string]: PictureInfo
}
