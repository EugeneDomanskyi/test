import { useSelector } from 'react-redux'

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

export default function Details() {
  return (
    <App.Flex column sx={{paddingTop: 64}} gap={96}>
      <Info />
      <LivePrice />
      <Stats />
      <About />
      <Images />
      <Ad />
      <Team />
      <Investors />
      <Resources />
      <FAQ />
    </App.Flex>
  )
}
