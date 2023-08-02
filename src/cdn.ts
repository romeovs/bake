import { Request } from "./matrix"
import { filename } from "./filename"
import {
	PROJECT,
	S3_ENDPOINT,
	S3_BUCKET,
	CDN_URL_FORMAT,
} from "./config"

export function cdn(req: Request): string | undefined {
	if (!CDN_URL_FORMAT) {
		return undefined
	}

	return CDN_URL_FORMAT.replace("{bucket}", S3_BUCKET)
		.replace("{endpoint}", S3_ENDPOINT)
		.replace("{project}", PROJECT)
		.replace("{filename}", filename(req))
}
