import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFeatures = () => {
  return (
    <App.Container maxWidth={1230} sx={[{ paddingTop: 32, paddingBottom: 32 }, { paddingTop: 48, paddingBottom: 32 }]}>
      <App.Flex column align="center" gap={32} fullWidth className={styles.container}>
        <div className={styles.background1} />
        <div className={styles.background2} />

        <App.Flex direction={['row', 'column']} center gap={[40, 20]}>
          <App.Flex row center flex={1}>
            <App.Text size={[80, 63]} weight={800} height={1}>Main <App.Text inline size={[80, 63]} weight={800} family="Playfair Display" height={1} color="#A6DC37">Features</App.Text></App.Text>
          </App.Flex>

          <div className={styles.sep} />

          <App.Flex flex={1}>
            <App.Text size={12} weight={400} color="rgba(255, 255, 255, .6)">
              Elementum lectus at est enim. Mi lacus venenatis sapien suspendisse tincidunt nulla. Lacus quam urna dictumst dui. Faucibus viverra vel morbi duis amet. Sit vitae tristique eget nibh nibh. Ipsum imperdiet sem condimentum proin sodales vel pellentesque et nullam. Vel suspendisse amet arcu ut tristique massa enim.
            </App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={[790, '100%']} gap={16}>
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-1.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Custody</App.Text>
                <App.Text size={[16, 24]} weight={600}>Less Orders</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Habitant porttitor morbi amet molestie euismod egestas. Quis eget eu volutpat in et ipsum amet duis. Massa nisl in eget tristique semper facilisi sit. 
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-2.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Gasless</App.Text>
                <App.Text size={[16, 24]} weight={600}>Cancellations</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Cursus pharetra lacus faucibus vulputate. Bibendum egestas non odio porta sollicitudin id. 
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-3.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Significant</App.Text>
                <App.Text size={[16, 24]} weight={600}>Gas Savings</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              At laoreet eget lacus in. Pharetra pellentesque dui facilisis ipsum arcu varius integer consequat. Leo magna tristique feugiat dapibus integer. Vivamus risus vel habitasse consequat sed.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-4.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Orderbooks</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Massa arcu hac sagittis aenean. Tincidunt eleifend eleifend lacus tristique suscipit. Tortor nulla tortor vitae purus. 
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-5.png" alt="" />

              <App.Flex column>
                <App.Text size={[16, 24]} weight={600}>Trading</App.Text>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">The Alpha</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Eu id vehicula fringilla auctor. Metus orci hendrerit netus magna in in gravida nunc. Sollicitudin lorem sodales odio mus lorem et sit adipiscing.
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeFeatures