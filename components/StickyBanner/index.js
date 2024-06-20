import React from 'react';
import cn from 'classnames';

import App from '@/components/App';

import styles from './styles.module.scss';

const StickyBanner = ({ onClose, onOpen, show }) => {
  const handleClose = () => {
    onClose()
  }
  
  const handleOpen = () => {
    onOpen()
  }

  return (
    <App.Flex center className={cn(styles.container, {[styles.open]: show})} onClick={handleOpen}>
      <App.Flex className={styles.textWrapper}>
        <App.Text center size={16} weight={600}>
          Collect GEMS on every trade 🚀 Join the Tegro Gems Program!
        </App.Text>
        
        <App.Flex center className={styles.getStarted}>
          <App.Text size={16} weight={600}>
            GET STARTED
          </App.Text>

          <App.Flex className={styles.getStartedIcon}>
            <App.Icon icon="arrow-right" width={16} height={16} />
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex className={styles.lines}>
        <App.Flex className={styles.line} />
        <App.Flex className={styles.line} />
      </App.Flex>

      <App.Flex center className={styles.close} onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}>
        <App.Icon icon="cross" color="#fff" width={16} height={16} />
      </App.Flex>
    </App.Flex>
  );
};

export default StickyBanner;