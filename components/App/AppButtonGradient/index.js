import AppFlex from '@/components/App/AppFlex'
import AppFrame from '@/components/App/AppFrame'
import AppText from '@/components/App/AppText'
import AppIcon from '@/components/App/AppIcon'

const AppButtonGradient = ({ children, icon, large, width, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <AppFrame button padding={large ? '16px 32px' : '10px 24px'} width={width} radius={50} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)" sx={{ cursor: 'pointer' }} onClick={handleClick}>
      <AppFlex row center fullWidth gap={16}>
        <AppText center nowrap>{children}</AppText>
        {icon ? <AppIcon icon={icon} /> : null}
      </AppFlex>
    </AppFrame>
  )
}

export default AppButtonGradient