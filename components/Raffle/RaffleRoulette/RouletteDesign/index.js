import React from 'react'
import Image from 'next/image'

export const TopChildren = ({ type, hideCenterDelimiter }) =>
  hideCenterDelimiter !== true ? (
    <div
      data-testid="design-top"
      className={`roulette-pro-regular-design-top ${type}`}
    />
  ) : null

const rouletteDesign = (props) => {
  const { prizesWithText, hideCenterDelimiter } = props
  const prizeItemWidth = 205
  const prizeItemHeightWithoutText = props.type === 'vertical' ? 172 : 174
  const prizeItemHeight = prizesWithText === true ? 234 : prizeItemHeightWithoutText
  const prizeItemClassName = `roulette-pro-regular-design-prize-item-${props.type}`

  return {
    topChildren: (
      <TopChildren type={props.type} hideCenterDelimiter={hideCenterDelimiter} />
    ),
    bottomChildren: null,
    prizeItemWidth,
    prizeItemHeight,
    prizeItemRenderFunction: ({ image, text }) => {
      const withText = prizesWithText === true && text !== undefined

      return (
        <div
          className="roulette-pro-regular-prize-item"
          style={{ width: prizeItemWidth, height: prizeItemHeight }}
        >
          <div
            className={
              withText === true
                ? 'rouletteProRegularPrizeItemWrapper'
                : 'rouletteProRegularPrizeItemWrapper center'
            }
          >
            <div className="rouletteProRegularImageWrapper">
              <Image src={image} width={110} height={101} className="roulette-pro-regular-prize-item-image" alt='' />
              {/* <img
                className="roulette-pro-regular-prize-item-image"
                src="/images/raffle/lootbox.png"
                alt={withText === true ? `prize item ${text}` : 'prize item'}
              /> */}
              {/* <img
                className="roulette-pro-regular-prize-item-image"
                src={image}
                alt={withText === true ? `prize item ${text}` : 'prize item'}
              /> */}
            </div>
            {withText === true && (
              <p className="roulette-pro-regular-prize-item-text">{text}</p>
            )}
          </div>
        </div>
      )
    },
    classes: {
      prizeItem: prizeItemClassName,
    },
  }
}

export default rouletteDesign
