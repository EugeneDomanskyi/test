import { userAgentFromString } from 'next/server'

import WagmiHelper from '@/libs/WagmiHelper'

import $token from '@/store/token'

const Exchange = () => {
  return (
    <div />
  )
}

export async function getServerSideProps(ctx) {
  const chainCode = WagmiHelper.getCurrentChainCode(ctx)
  
  const { device } = userAgentFromString(ctx.req.headers['user-agent'])
  const isMobile = device.type === 'mobile'

  return {
    redirect: {
      destination: `/exchange/${chainCode}` + (isMobile ? '' : `/0x`),
      permanent: false,
    },
  }
}

export default Exchange