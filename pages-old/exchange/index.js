import WagmiHelper from '@/libs/WagmiHelper'

const Exchange = () => {
  return (
    <div />
  )
}

export async function getServerSideProps(ctx) {
  const chainCode = WagmiHelper.getCurrentChainCode(ctx)

  return {
    redirect: {
      destination: `/exchange/${chainCode}/0x`,
      permanent: false,
    },
  }
}

export default Exchange