import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import AppHelper from '@/libs/AppHelper'

import $app from '@/store/app'

const useAppHelper = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)

  useEffect(() => {
    AppHelper.init(isApp, receive)
    AppHelper.send({ loaded: true })
  }, [])

  const receive = (data: any) => {
    if (data?.wpk) {
      dispatch($app.set.appConnected(false))
      dispatch($app.set.wpk(data.wpk))
    }

    if (data?.chainCode) {
      dispatch($app.set.code(data.chainCode))
      router.replace(`/exchange/${data.chainCode}`)
    }
  }
}

export default useAppHelper