import { getAssetsFile } from '@/libs/aws.lib'

function generateSiteMap(markets) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${markets
       .map(market => {
         return `
       <url>
           <loc>${`https://x.tegro.com/market/tokens/${market.blockchain}/${market.address}`}</loc>
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

export async function getServerSideProps({ res }) {
  const marketList = await getAssetsFile()
  const markets = marketList.map(item => {
    return {address: item.address, blockchain: item.blockchain}
  })

  const sitemap = generateSiteMap(markets)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap