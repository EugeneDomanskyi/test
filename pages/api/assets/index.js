import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'

const handler = async (req, res) => {
  const payload = JSON.parse(req.body)
  const { serverRuntimeConfig } = getConfig()
  const filePath = path.join(serverRuntimeConfig.PROJECT_ROOT, './public/files', 'assets.json')
  const fileData = await fs.promises.readFile(filePath)
  const objectData = JSON.parse(fileData)
  const exist = objectData.find(asset => asset.address === payload.address)
  if (exist) {
    res.status(200).json(objectData)
    return
  }
  objectData.push(payload)
  const updatedData = JSON.stringify(objectData)
  await fs.promises.writeFile(filePath, updatedData)
  res.status(200).json(objectData)
}

export default handler
