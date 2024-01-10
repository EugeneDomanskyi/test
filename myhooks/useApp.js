import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const useApp = () => {
  const isApp = useSelector(({ $app }) => $app.isApp)

  const [appData, setAppData] = useState()

  useEffect(() => {
    window.appDataHandler = appDataHandler
  }, [])

  const appDataHandler = (data) => {
    if (isApp && data) {
      setAppData(data)
    }
  }

  const appPost = (data) => {
    if (isApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data))
    }
  }

  const appLog = (data) => {
    appPost({ log: data })
  }

  return { isApp, appData, appPost, appLog }
}

export default useApp