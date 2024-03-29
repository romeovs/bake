import { promises as fs } from "fs"
import path from "path"
import { HttpsAgent } from "agentkeepalive"

import aws from "aws-sdk"
import { RateLimiter } from "limiter"

import { filename } from "./filename"
import { Request } from "./matrix"

import {
	PROJECT,
	S3_ENDPOINT,
	S3_ACCESS_KEY,
	S3_SECRET_KEY,
	S3_URL_FORMAT,
	S3_BUCKET,
	S3_RATE_LIMIT,
	CACHE,
	SKIP_UPLOAD,
	MAX_SOCKETS,
} from "./config"

const agent = new HttpsAgent({
	keepAlive: true,
	maxSockets: MAX_SOCKETS,
})

const s3 = new aws.S3({
	endpoint: S3_ENDPOINT,
	accessKeyId: S3_ACCESS_KEY,
	secretAccessKey: S3_SECRET_KEY,
	httpOptions: {
		agent,
	},
})

const limiter = new RateLimiter({
	tokensPerInterval: S3_RATE_LIMIT,
	interval: "second",
})

export async function upload(req: Request): Promise<string> {
	if (SKIP_UPLOAD) {
		return format(req)
	}

	const fname = filename(req)
	const body = await fs.readFile(path.resolve(CACHE, "im", fname))
	const uri = `${PROJECT}/${fname}`

	const params = {
		Bucket: S3_BUCKET,
		Key: uri,
		Body: body,
		ContentType: `image/${req.format}`,
		ACL: "public-read",
	}

	await limiter.removeTokens(1)

	const data = await s3.upload(params).promise()
	return data.Location
}

function format(req: Request): string {
	return S3_URL_FORMAT.replace("{bucket}", S3_BUCKET)
		.replace("{endpoint}", S3_ENDPOINT)
		.replace("{project}", PROJECT)
		.replace("{filename}", filename(req))
}

export async function exists(req: Request): Promise<string | null> {
	if (SKIP_UPLOAD) {
		return null
	}

	const fname = filename(req)
	const uri = `${PROJECT}/${fname}`

	const params = {
		Bucket: S3_BUCKET,
		Key: uri,
	}

	await limiter.removeTokens(1)

	try {
		const h = await s3.headObject(params).promise()
		if (h.ContentLength === 0) {
			return null
		}

		return format(req)
	} catch (err) {
		return null
	}
}
