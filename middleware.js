import { NextResponse, userAgent } from 'next/server'
import { ResponseCookies, RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { CHAINS } from '@/config'

const applySetCookie = (req, res) => {
  const setCookies = new ResponseCookies(res.headers)
  const newReqHeaders = new Headers(req.headers)
  const newReqCookies = new RequestCookies(newReqHeaders)
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie))
  NextResponse.next({request: { headers: newReqHeaders }}).headers.forEach((value, key) => {
    if (key === 'x-middleware-override-headers' || key.startsWith('x-middleware-request-')) {
      res.headers.set(key, value)
    }
  })
}

const middleware = (request) => {
  const response = NextResponse.next()
  const { device } = userAgent(request)
  const isMobile = device.type === 'mobile'
  const [_, seg1, seg2, seg3] = request.nextUrl.pathname.split('/')

  let validBlockhains = CHAINS.filter(item => item.pages.some(el => el == seg1))
  if (!validBlockhains.length) {
    // validBlockhains = CHAINS.filter(item => item.defaultFor == process.env.NEXT_PUBLIC_APP_ENV)
    validBlockhains = CHAINS.filter(item => item.defaultFor)
  }

  if (seg1 === 'exchange') {
    let blockchain = seg2 ?? request.cookies.get('blockchain')?.value
    if (!validBlockhains.some(item => item.code == blockchain)) {
      blockchain = validBlockhains[0]?.code
    }

    response.cookies.delete('blockchain')
    response.cookies.set('blockchain', blockchain)
    applySetCookie(request, response)

    if ((!seg2 || !seg3) && !isMobile) {
      return NextResponse.redirect(new URL(`/${seg1}/${blockchain}/${seg3 ?? '0x'}`, request.url))
    } else if (isMobile && (!seg2 || seg2 && blockchain != seg2)) {
      return NextResponse.redirect(new URL(`/${seg1}/${blockchain}`, request.url))
    }
  } else {
    let blockchain = request.cookies.get('blockchain')?.value
    if (!validBlockhains.some(item => item.code == blockchain)) {
      blockchain = validBlockhains[0]?.code
    }

    response.cookies.delete('blockchain')
    response.cookies.set('blockchain', blockchain)
    applySetCookie(request, response)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|fonts|favicon.ico).*)',
  ],
  // runtime: 'experimental-edge',
  unstable_allowDynamic: [
    '/node_modules/@metamask/sdk/dist/browser/umd/metamask-sdk.js',
    '/node_modules/@walletconnect/universal-provider/dist/index.es.js',
    '/node_modules/lodash.isequal/index.js',
  ],
}

export default middleware
