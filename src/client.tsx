import * as React from "react"

import { parse } from "./filename"
import { Format } from "./format"
import { PictureInfo, SrcInfo } from "./manifest"
import { decompress, CompressedPictureInfo } from "./compress"

export { compress, decompress } from "./compress"
export { parse }

export type PictureProps = {
	sizes: string
	picture: PictureInfo | CompressedPictureInfo
}

export function toKey(picture: PictureInfo | CompressedPictureInfo): string {
	if ("srces" in picture) {
		return picture.srces[0].key
	}

	return picture.s[0]
}

export function Picture(props: PictureProps): React.ReactNode {
	const { picture, sizes, ...rest } = props
	const pic = decompress(picture as PictureInfo)

	return (
		<picture {...rest}>
			<Source format="avif" picture={pic} sizes={sizes} />
			<Source format="webp" picture={pic} sizes={sizes} />
			<Source format="jpeg" picture={pic} sizes={sizes} />
			<Source format="png" picture={pic} sizes={sizes} />
			<Source format="gif" picture={pic} sizes={sizes} />
		</picture>
	)
}

type SourceProps = {
	format: Format
	picture: PictureInfo
	sizes: string
}

const Source = React.memo(function Source(props: SourceProps) {
	const { format, picture, sizes } = props

	const ims = picture.srces.filter((x) => x.format === format)

	if (ims.length === 0) {
		return null
	}

	const src = ims[0]?.cdn ?? ims[0]?.url
	if (!src) {
		return null
	}

	const fallback = ims.length === picture.srces.length
	const srcSet = ims
		.sort(byWidth)
		.map((x) => `${x.cdn ?? x.url} ${x.width}w`)
		.join(", ")

	if (fallback || format === "jpeg" || format === "png" || format === "gif") {
		return <img src={src} srcSet={srcSet} sizes={sizes} />
	}

	return <source type={`image/${format}`} src={src} srcSet={srcSet} sizes={sizes} />
})

function byWidth(a: SrcInfo, b: SrcInfo): number {
	return a.width - b.width
}
