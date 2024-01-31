import App from '@/components/App'

const ProgressBar = ({size = 200, trackWidth = 21, progress = 72, ...props}) => {
  const center = size / 2
  const radius = center
  const dashArray = 2 * Math.PI * radius
  const dashOffset = dashArray * ((100 - progress) / 100)

  const styles = {
    position: 'relative',
    backgroundImage: `url(/images/tournament/progress_bar_bg.png)`,
    backgroundSize: 'cover',
    backgroundPositionY: 5,
    backgroundPositionX: 'center',
  }

  return (
      <App.Flex sx={styles}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{
              transform: "rotate(-90deg) scale(1, -1)",
            }}
            viewBox={`-${size * 0.125} -${size * 0.125} ${size * 1.25} ${size * 1.25}`}
            {...props}
        >
          <circle
              cx={center}
              cy={center}
              r={size / 2}
              fill="transparent"
              stroke="#121019"
              strokeDasharray={dashArray}
              strokeWidth={trackWidth}
          />
          <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="url(#circleGradient)"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth={trackWidth}
          />
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#563AFF', stopOpacity: 1}}/>
            <stop offset="100%" style={{stopColor: '#BBFE2B', stopOpacity: 1}}/>
          </linearGradient>
        </svg>
        <App.Flex column sx={{position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%'}}>
          <App.Text family={'Playfair Display'} size={40}>{progress} %</App.Text>
          <App.Text weight={400} size={12} color={'#9B99AE'}>path completed</App.Text>
        </App.Flex>
      </App.Flex>

  )
}

export default ProgressBar
