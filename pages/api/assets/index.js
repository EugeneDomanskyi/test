import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'

import { getAssetsFile, putAssetsFile } from '@/libs/aws.lib'

const handler = async (req, res) => {
  const body = req.body
  const method = req.method
  const filePath = '/Users/dd/projects/nft20/public/files/assets_ethereum.json'
  const partOnefilePath = '/Users/dd/projects/nft20/public/files/assets_ethereum_part_one.json'
  
  if (method === 'GET') {
    try {
      const fileContents = await fs.promises.readFile(partOnefilePath)
      const parsedData = JSON.parse(fileContents)
      return res.status(200).json(parsedData)
    } catch (error) {
      console.error('Error reading file:', error);
      throw error; // Optionally, re-throw the error to handle it elsewhere
    }
  }
  const { serverRuntimeConfig } = getConfig()
  

  const jsonBody = JSON.stringify(body);

  // const filePath = path.join(serverRuntimeConfig.PROJECT_ROOT, './public/files', 'assets.json')
  fs.promises.writeFile(filePath, jsonBody)
  .then(() => {
    console.log('File written successfully');
  })
  .catch((err) => {
    console.error('Error writing file:', err);
  });
  // await fs.promises.writeFile(filePath, body)
  res.status(200).json(body)
}

export default handler
