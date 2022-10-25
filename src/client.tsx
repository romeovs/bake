import * as React from "react"
import type { PictureData } from "."

import { parse } from "./filename"
import { Format } from "./format"
import { Info } from "./manifest"

export { parse, PictureData }

export type PictureProps = PictureData & { sizes: string }

export function Picture(props: PictureProps): React.ReactNode {
	const { b, s, sizes, ...rest } = props
	const info = React.useMemo(() => s.map(parse).sort(byWidth), [s])

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

	const ims = info.filter((x) => x.format === format)
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
