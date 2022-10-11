import { promises as fs } from "fs"
import path from "path"

import aws from "aws-sdk"

import { CACHE } from "./config"
import { filename } from "./filename"

import { PROJECT, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, CACHE } from "./config"

const s3 = new aws.S3({
	endpoint: S3_ENDPOINT,
	accessKeyId: S3_ACCESS_KEY,
	secretAccessKey: S3_SECRET_KEY,
})

export async function upload(req: Request): Promise<string> {
	const fname = filename(req)
	const body = await fs.readFile(path.resolve(CACHE, fname))
	const uri = `${PROJECT}/${fname}`

	const params = {
		Bucket: S3_BUCKET,
		Key: uri,
		Body: body,
		ContentType: `image/${req.format}`,
		ACL: "public-read",
	}

	const data = await s3.upload(params).promise()
	return data.Location
}

export async function exists(req: Request): Promise<string> {
	const fname = filename(req)
	const uri = `${PROJECT}/${fname}`

	const params = {
		Bucket: S3_BUCKET,
		Key: uri,
	}

	try {
		await s3.headObject(params).promise()
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}
