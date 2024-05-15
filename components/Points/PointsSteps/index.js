import React from 'react';
import Image from 'next/image';
import cn from 'classnames';

import styles from './styles.module.scss'
import App from '@/components/App';

const steps = [
  {
    subtitle: 'Step 1',
    title: 'Visit the Tegro Exchange',
    image: '/images/points/points-step-1-big.png',
    width: 181,
    height: 80
  },
  {
    subtitle: 'Step 2',
    title: 'Create orders to collect points',
    image: '/images/points/points-step-2.png',
    width: 90,
    height: 81,
  },
  {
    subtitle: 'Step 3',
    title: 'Climb the leaderboard',
    image: '/images/points/points-step-3.png',
    width: 133,
    height: 80,
  },
]

const PointsSteps = ({ full = null }) => {
  return (
    <App.Flex className={styles.container} gap={16}>
      {
        steps.map((step, index) => {
          return (
            <App.Flex key={index} className={cn(styles.item, {[styles.full]: full})}>
              <App.Flex column className={styles.textBlock}>
                <App.Text color="#A6DC37" size={14} weight={600}>{step.subtitle}</App.Text>
                <App.Text className={styles.title} weight={600}>{step.title}</App.Text>
              </App.Flex>
  
              <App.Flex className={cn(styles.image, {[styles.first]: index === 0, [styles.short]: index === 0 && ! full})}>
                <Image src={step.image} width={step.width} height={step.height} />
              </App.Flex>
            </App.Flex>
          )
        })
      }
    </App.Flex>
  );
};

export default PointsSteps;