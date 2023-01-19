import * as React from "react"

import { parse } from "./filename"
import { Format } from "./format"
import { PictureInfo, SrcInfo } from "./manifest"

export { parse }

export type PictureProps = {
	sizes: string
	picture: PictureInfo
}

export function Picture(props: PictureProps): React.ReactNode {
	const { picture, sizes, ...rest } = props

	return (
		<picture {...rest}>
			<Source format="avif" picture={picture} sizes={sizes} />
			<Source format="webp" picture={picture} sizes={sizes} />
			<Source format="jpeg" picture={picture} sizes={sizes} />
			<Source format="png" picture={picture} sizes={sizes} />
			<Source format="gif" picture={picture} sizes={sizes} />
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

	const src = ims[0]?.url
	if (!src) {
		return null
	}

	const fallback = ims.length === picture.srces.length
	const srcSet = ims
		.sort(byWidth)
		.map((x) => `${x.url} ${x.width}w`)
		.join(", ")

	if (fallback || format === "jpeg" || format === "png" || format === "gif") {
		return <img src={src} srcSet={srcSet} sizes={sizes} />
	}

	return <source type={`image/${format}`} src={src} srcSet={srcSet} sizes={sizes} />
})

function byWidth(a: SrcInfo, b: SrcInfo): number {
	return a.width - b.width
}
