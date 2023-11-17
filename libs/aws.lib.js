
import * as AWS from "@aws-sdk/client-s3"

const accessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY
const secretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY
const region = process.env.NEXT_PUBLIC_AWS_REGION
const bucketName = 'tegro-imagekit-tora'
const jsonFileName = 'ids-sitemap.json'
// const jsonFileName = 'assets.json'

const client = new AWS.S3({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: region,
})

const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

export const getAssetsFile = async () => {
  const input = {
    Bucket: bucketName,
    Key: jsonFileName,
  }
  const command = new AWS.GetObjectCommand(input)
  const response = await client.send(command)
  const bodyContents = await streamToString(response.Body)
  return JSON.parse(bodyContents)
}