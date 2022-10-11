import { promises as fs } from "fs"
import path from "path"

import aws from "aws-sdk"

import { PROJECT, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, CACHE } from "./config"

const s3 = new aws.S3({
	endpoint: S3_ENDPOINT,
	accessKeyId: S3_ACCESS_KEY,
	secretAccessKey: S3_SECRET_KEY,
})

export async function upload(req: Request): Promise<string> {
	const filename = `${req.key}.${req.width}.${req.format}`
	const file = path.resolve(CACHE, filename)
	const body = await fs.readFile(file)
	const uri = `${PROJECT}/${filename}`

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
