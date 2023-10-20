import { getAssetsFile } from '@/libs/aws.lib'

function generateSiteMap(markets, origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${markets
       .map(market => {
         return `
       <url>
           <loc>${`${origin}/market/tokens/${market.blockchain}/${market.address}`}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res, req }) {
  const origin = `${req.headers['x-forwarded-proto']}://${req.headers.host}`;

  const marketList = await getAssetsFile()
  const markets = marketList.map(item => {
    return {address: item.address, blockchain: item.blockchain}
  })

  const sitemap = generateSiteMap(markets, origin)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {
      origin
    },
  }
}

export default SiteMap