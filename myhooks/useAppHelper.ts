import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AppHelper from '@/libs/AppHelper'

import $app from '@/store/app'

const useAppHelper = () => {
  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)

  useEffect(() => {
    AppHelper.init(isApp, receive)
    AppHelper.send({ loaded: true })
  }, [])

  const receive = (data: any) => {
    if (data.hasOwnProperty('devMode')) {
      dispatch($app.set.devMode(data.devMode))
    }

    if (data?.wpk) {
      dispatch($app.set.wpk(data.wpk))
    }

    if (data?.chainCode) {
      dispatch($app.set.code(data.chainCode))
    }
  }
}

export default useAppHelper