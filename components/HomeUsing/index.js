import Image from 'next/image'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeUsing = () => {
  const { propValue } = usePropsHelper()

  return (
    <App.Container>
      <App.Flex column align="center" gap={[64, 32]}>
        <App.Flex column align="center" gap={24}>
          <App.Text center size={[40, 28]} weight={700} height={[1, 1.4]}>What are NFT-20s</App.Text>
          <App.Text center size={[20, 16]} weight={700} height={[1, 1.4]} color="#B9B8C5">NFT20s Are ERC20 Tokens Issued 1:1 Against Your NFTs</App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} gap={[22, 16]} width="100%">
          <App.Flex flex={1} sx={{ overflow: 'hidden' }}>
            <App.Frame radius={[24, 12]} sx={{ position: 'relative' }} padding={['64px 32px 32px 32px', 16]} width="100%" background="linear-gradient(180deg, #171036 0%, rgba(23, 16, 54, 0.00) 100%), #0E0B23" gradient="linear-gradient(#401698, #29015B)">
              <App.Flex column gap={[32, 16]}>
                <Image src="/images/puzzle-box.png" width={propValue([90, 60], true)} height={propValue([90, 60], true)} alt="" />

                <App.Flex column sx={{ position: 'relative', zIndex: 1 }}>
                  <App.Text size={[28, 24]} weight={700}>Fractional</App.Text>
                  <App.Text size={[16, 14]} color="#B9B8C5">Trade in fractions, starting for as low as $0.01!</App.Text>
                </App.Flex>

                <div className={styles.nestedParent}>
                  <div className={styles.nested1}>
                    <div className={styles.nested2}>
                      <div className={styles.nested3}>
                        <div className={styles.nested4}>
                          <div className={styles.nested5}>
                            <div className={styles.nested6}>
                              <div className={styles.nested7}>
                                <div className={styles.nested8}>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </App.Flex>
            </App.Frame>
          </App.Flex>

          <App.Flex flex={1} sx={{ overflow: 'hidden' }}>
            <App.Frame radius={[24, 12]} sx={{ position: 'relative' }} padding={['64px 32px 32px 32px', 16]} width="100%" background="linear-gradient(180deg, #171036 0%, rgba(23, 16, 54, 0.00) 100%), #0E0B23" gradient="linear-gradient(#401698, #29015B)">
              <App.Flex column gap={[32, 16]}>
                <Image src="/images/decent-box.png" width={propValue([90, 60], true)} height={propValue([90, 60], true)} alt="" />

                <App.Flex column sx={{ position: 'relative', zIndex: 1 }}>
                  <App.Text size={[28, 24]} weight={700}>Decentralized</App.Text>
                  <App.Text size={[16, 14]} color="#B9B8C5">Completely trustless. Verify assets on-chain. Your keys, your tokens.</App.Text>
                </App.Flex>

                <div className={styles.nestedParent}>
                  <div className={styles.nested1}>
                    <div className={styles.nested2}>
                      <div className={styles.nested3}>
                        <div className={styles.nested4}>
                          <div className={styles.nested5}>
                            <div className={styles.nested6}>
                              <div className={styles.nested7}>
                                <div className={styles.nested8}>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </App.Flex>
            </App.Frame>
          </App.Flex>

          <App.Flex flex={1} sx={{ overflow: 'hidden' }}>
            <App.Frame radius={[24, 12]} sx={{ position: 'relative' }} padding={['64px 32px 32px 32px', 16]} width="100%" background="linear-gradient(180deg, #171036 0%, rgba(23, 16, 54, 0.00) 100%), #0E0B23" gradient="linear-gradient(#401698, #29015B)">
              <App.Flex column gap={[32, 16]}>
                <Image src="/images/multi-box.png" width={propValue([90, 60], true)} height={propValue([90, 60], true)} alt="" />

                <App.Flex column sx={{ position: 'relative', zIndex: 1 }}>
                  <App.Text size={[28, 24]} weight={700}>Multi-Asset Swap</App.Text>
                  <App.Text size={[16, 14]} color="#B9B8C5">Remove trade restrictions. Swap NFT20s for any token or coin.</App.Text>
                </App.Flex>

                <div className={styles.nestedParent}>
                  <div className={styles.nested1}>
                    <div className={styles.nested2}>
                      <div className={styles.nested3}>
                        <div className={styles.nested4}>
                          <div className={styles.nested5}>
                            <div className={styles.nested6}>
                              <div className={styles.nested7}>
                                <div className={styles.nested8}>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </App.Flex>
            </App.Frame>
          </App.Flex>

          <App.Flex flex={1} sx={{ overflow: 'hidden' }}>
            <App.Frame radius={[24, 12]} sx={{ position: 'relative' }} padding={['64px 32px 32px 32px', 16]} width="100%" background="linear-gradient(180deg, #171036 0%, rgba(23, 16, 54, 0.00) 100%), #0E0B23" gradient="linear-gradient(#401698, #29015B)">
              <App.Flex column gap={[32, 16]}>
                <Image src="/images/mining-box.png" width={propValue([90, 60], true)} height={propValue([90, 60], true)} alt="" />

                <App.Flex column sx={{ position: 'relative', zIndex: 1 }}>
                  <App.Text size={[28, 24]} weight={700}>Liquidity Mining</App.Text>
                  <App.Text size={[16, 14]} color="#B9B8C5">Add liquidity to pools. Earn fees (and more) from trades.</App.Text>
                </App.Flex>

                <div className={styles.nestedParent}>
                  <div className={styles.nested1}>
                    <div className={styles.nested2}>
                      <div className={styles.nested3}>
                        <div className={styles.nested4}>
                          <div className={styles.nested5}>
                            <div className={styles.nested6}>
                              <div className={styles.nested7}>
                                <div className={styles.nested8}>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </App.Flex>
            </App.Frame>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeUsing