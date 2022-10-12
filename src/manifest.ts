import { Format } from "./format"

export type Info = {
	key: string
	hash: string
	url: string
	format: Format
	width: number
	height: number
}

export type Manifest = {
	[key: string]: Info[]
}
