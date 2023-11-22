const formats = ["jpeg", "webp", "avif", "png", "gif"] as const

export type Format = typeof formats[number]

export function isFormat(format: string): format is Format {
	// @ts-expect-error
	return formats.includes(format)
}

export function asFormat(format: string): Format {
	if (isFormat(format)) {
		return format
	}
	if (format === "jpg") {
		return "jpeg"
	}

	throw new Error(`format not recognised: ${format}`)
}
