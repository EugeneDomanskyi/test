import fs from 'fs'
import path from 'path'
import moment from 'moment'

const storage = path.join(process.cwd(), 'public', 'storage')
const file = path.join(storage, 'stats.json')

const formatNumber = (number) => {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q']
  let suffixIndex = 0

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000
    suffixIndex++
  }

  return `${number.toFixed(1)}${suffixes[suffixIndex]}`
}

const refreshData = async (stats) => {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }

  try {
    const calls = [
      fetch(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/27/card/33`, options),
      fetch(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/25/card/32`, options),
      fetch(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/9/card/11`, options),
      fetch(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/8/card/8`, options),
      fetch(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/6/card/10`, options),
    ]

    const [volume, created, gas, settled, cancelled] = await Promise.all(calls)
    if (volume?.ok) {
      const json = await volume.json()
      if (json?.data) {
        stats.volume = formatNumber(json.data.rows[0][0])
      }
    }

    if (created?.ok) {
      const json = await created.json()
      if (json?.data) {
        stats.created = formatNumber(json.data.rows[0][0])
      }
    }

    if (gas?.ok) {
      const json = await gas.json()
      if (json?.data) {
        stats.gas = formatNumber(json.data.rows[0][0])
      }
    }

    if (settled?.ok) {
      const json = await settled.json()
      if (json?.data) {
        stats.settled = formatNumber(json.data.rows[0][0])
      }
    }

    if (cancelled?.ok) {
      const json = await cancelled.json()
      if (json?.data) {
        stats.cancelled = formatNumber(json.data.rows[0][0])
      }
    }

    stats.day = moment().startOf('day').valueOf()

    if (!fs.existsSync(storage)) {
      fs.mkdirSync(storage, { recursive: true })
    }
    fs.writeFileSync(file, JSON.stringify(stats))

    return stats
  } catch (error) {
    stats.message = error.toString()
    return stats
  }
}

const handler = async (req, res) => {
  const today = moment().startOf('day').valueOf()
  let stats = { day: 0, volume: 0, created: 0, gas: 0, settled: 0, cancelled: 0 }

  try {
    const data = fs.readFileSync(file)
    if (data) {
      stats = JSON.parse(data)
      stats.message = 'Read JSON file'
      if (stats.day > today) {
        refreshData(stats)
        stats.message = 'Refresh JSON file'
      }
    }
  } catch (err) {
    stats = await refreshData(stats)
    stats.message = stats.message ?? 'No JSON file'
  }

  res.status(200).json(stats)
}

export default handler