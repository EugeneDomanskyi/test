import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts'
import numeral from 'numeral'
import moment from 'moment'

import AppText from '@/components/AppText'

const Chart = ({data, dataKey, onShowTooltip, onHideTooltip}) => {

  const renderTooltip = (e) => {
    if (!e.payload?.length) {
      return null
    }
    const [payload] = e.payload
    const date = moment(payload.payload.date*1000)
    return (
      <div style={{width: 300}}>
        <AppText size={24}>{ numeral(payload.value).format('$0.[00]a') }</AppText>
        <AppText size={12} color="rgba(255,255,255,0.6)">{ date.format('MMM DD YYYY') }</AppText>
      </div>
    )
  }

  return (
    <ResponsiveContainer width={1000} height={400} style={{width: '100%', height: '100%'}}>
      <BarChart width={1000} height={400} data={data} onMouseEnter={onShowTooltip} onMouseLeave={onHideTooltip}>
        <Bar dataKey={dataKey} fill="#2172E5" />
        <Tooltip
          active={true}
          position={{ x: 0, y: -50 }}
          content={renderTooltip}
          cursor={{ stroke: 'rgb(44, 47, 54)', strokeWidth: 1 }} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart