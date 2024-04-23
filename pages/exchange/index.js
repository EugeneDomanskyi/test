import { userAgentFromString } from 'next/server'
import nookies from 'nookies'

import Chains from '@/libs/Chains.lib'

const Exchange = () => {
  return (
    <div />
  )
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx, 'blockchain')
  let blockchain = cookies.blockchain
  if (!blockchain) {
    const domainName = ctx.req ? ctx.req.headers.host : window.location.hostname
    const chains = await Chains.list(domainName)
    blockchain = chains[0]?.code
    nookies.set(ctx, 'blockchain', blockchain, {path: '/'})
  }

  const { device } = userAgentFromString(ctx.req.headers['user-agent'])
  const isMobile = device.type === 'mobile'

  return {
    redirect: {
      destination: `/exchange/${blockchain}` + (isMobile ? '' : '/0x'),
      permanent: false,
    },
  }
}

export default Exchange