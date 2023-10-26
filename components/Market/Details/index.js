import App from '@/components/App'
import Info from '@/components/Market/Details/Info'
import LivePrice from '@/components/Market/Details/LivePrice'
import Stats from '@/components/Market/Details/Stats'
import About from '@/components/Market/Details/About'
import Images from '@/components/Market/Details/Images'
import Ad from '@/components/Market/Details/Ad'
import Team from '@/components/Market/Details/Team'
import Investors from '@/components/Market/Details/Investors'
import Resources from '@/components/Market/Details/Resources'
import FAQ from '@/components/Market/Details/FAQ'

export default function Details({marketInfo, type}) {
  return (
    <App.Flex column sx={{paddingTop: 64}} gap={96}>
      <Info type={type} marketInfo={marketInfo} />
      <LivePrice type={type} marketInfo={marketInfo} />
      <Stats marketInfo={marketInfo} />
      <About marketInfo={marketInfo} />

      {
        marketInfo?.sampleImages
          ? <Images />
          : null
      }
      
      <Ad />
      {
        marketInfo?.team
          ? <Team />
          : null
      }
      {
        marketInfo?.investors
          ? <Investors />
          : null
      }      
      <Resources />
      <FAQ type={type} marketInfo={marketInfo} />
    </App.Flex>
  )
}
