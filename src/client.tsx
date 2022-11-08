import * as React from "react"
import type { PictureData } from "."

import { parse } from "./filename"
import { Format } from "./format"
import { SrcInfo } from "./manifest"

export { parse, PictureData }

export type PictureProps = PictureData & { sizes: string }

export class Pic {
	_width: number
	_info: SrcInfo[]

	constructor(data: PictureData) {
		this._width = data.w
		this._info = data.s.map(parse).sort(byWidth)
	}

	get width() {
		return this._width
	}

	get ratio() {
		return this._info[0].width / this._info[0].height
	}

	get height() {
		return this._width / this.ratio
	}

	get sources(): SrcInfo[] {
		return this._info
	}
}

export function Picture(props: PictureProps): React.ReactNode {
	const { w, s, sizes, ...rest } = props
	const info = React.useMemo(() => new Pic({ w, s }).sources, [w, s])

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
	info: SrcInfo[]
	sizes: string
}

const Source = React.memo(function Source(props: SourceProps) {
	const { format, info, sizes } = props

	const ims = info.filter((x) => x.format === format)

	if (ims.length === 0) {
		return null
	}

	const src = ims[0]?.url
	const srcSet = ims.map((x) => `${x.url} ${x.width}w`).join(", ")

	if (format === "jpeg") {
		return <img src={src} srcSet={srcSet} sizes={sizes} />
	}

	return <source type={`image/${format}`} src={src} srcSet={srcSet} sizes={sizes} />
})

function byWidth(a: SrcInfo, b: SrcInfo): number {
	return a.width - b.width
}
