
const AWS = require('aws-sdk')
const fs = require('fs')

const accessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY
const secretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY
const region = process.env.NEXT_PUBLIC_AWS_REGION
const bucketName = 'tegro-imagekit-tora'
const jsonFileName = 'assets.json'

const s3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: region,
})

export const putAssetsFile = (body) => {
  const params = {
    Bucket: bucketName,
    Key: jsonFileName,
    Body: JSON.stringify(body),
    ContentType: 'application/json',
  }

  const image = grabTheImage(body.image)

  console.log('body', body);

  s3.putObject(params, (err, data) => {
    if (err) {
      console.error('Error creating/updating JSON file:', err)
    } else {
      console.log('JSON file created/updated successfully:', data)
    }
  })
}

const grabTheImage = async (url) => {
  // const response = await fetch.get(url, { responseType: 'stream' });
  // response.data.pipe(fs.createWriteStream(destinationPath));
}

export const getAssetsFile = async () => {
  const params = {
    Bucket: bucketName,
    Key: jsonFileName,
  }

  return new Promise((resolve, reject) =>  {
    s3.getObject(params, (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err)
        reject(err)
      } else {
        const jsonObject = JSON.parse(data.Body.toString('utf-8'))
        resolve(jsonObject)
      }
    })
  })
}