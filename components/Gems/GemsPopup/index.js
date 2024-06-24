import React from 'react';
import Image from 'next/image';

import App from '@/components/App';

import styles from './styles.module.scss';

const GemsPopup = ({ onClose, onStart }) => {
  return (
    <App.Flex center className={styles.container}>
      <App.Flex column align="center" className={styles.content}>
        <App.Flex className={styles.close} onClick={() => onClose()}>
          <App.Icon icon="cross" color="#fff" width={16} height={16} />
        </App.Flex>

        <Image src="/images/gems/gems-popup-bg.png" width={589} height={589} alt="" />
        
        <App.Flex column center className={styles.wrapper}>
          <Image src="/images/gems/gems-popup-text.png" width={464} height={78} className={styles.textImg} alt="" />

          <App.Text size={[20, 14]} weight={600} center>
            Join the Tegro Gems Program
          </App.Text>

          <App.Button primary2 sx={{width: 240}} onClick={onStart}>
            Get Started
          </App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  );
};

export default GemsPopup