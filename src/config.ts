import path from "path"

import { isFormat } from "./format"
import { env } from "./env"

export const PROJECT = env("BAKE_PROJECT")
export const IMAGES = env("BAKE_IMAGES", "src/**/*.{jpeg,jpg,webp,png,gif}")
export const CACHE = env("BAKE_CACHE", ".bake")
export const ROOT = path.resolve(env("BAKE_ROOT", "."))
export const QUALITY = parseInt(env("BAKE_QUALITY", "80"), 10)

export const SIZES = env("BAKE_SIZES", "512,1024,2048,3072,4096")
export const FORMATS = env("BAKE_FORMATS", "jpeg,webp,avif")

export const S3_ENDPOINT = env("S3_ENDPOINT")
export const S3_BUCKET = env("S3_BUCKET")
export const S3_ACCESS_KEY = env("S3_ACCESS_KEY")
export const S3_SECRET_KEY = env("S3_SECRET_KEY")
export const S3_URL_FORMAT = env("S3_URL_FORMAT", "https://{bucket}.{endpoint}/{project}/{filename}")
export const S3_RATE_LIMIT = parseInt(env("S3_RATE_LIMIT", "120"), 10)

console.log(env("BAKE_SKIP_UPLOAD", "0") === "1")
export const SKIP_UPLOAD = env("BAKE_SKIP_UPLOAD", "0") === "1"

export const sizes = SIZES.split(",").map((str) => parseInt(str, 10))
export const formats = FORMATS.split(",").filter(isFormat)
