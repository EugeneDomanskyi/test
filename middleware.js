import { NextResponse } from 'next/server'
import { ResponseCookies, RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

const DEFAULT_BLOCKCHAIN = 'ethereum'

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
  const isMobile = request.headers.get('user-agent').match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
  const [_, seg1, seg2, seg3] = request.nextUrl.pathname.split('/')
  if (seg1 === 'exchange') {
    const blockchain = seg2 ?? request.cookies.get('blockchain')?.value ?? DEFAULT_BLOCKCHAIN
    response.cookies.delete('blockchain')
    response.cookies.set('blockchain', blockchain)
    applySetCookie(request, response)
    if ((!seg2 || !seg3) && !isMobile) {
      return NextResponse.redirect(new URL(`/exchange/${blockchain}/${seg3 ?? '0x'}`, request.url))
    } else if (isMobile && !seg2) {
      return NextResponse.redirect(new URL(`/exchange/${blockchain}`, request.url))
    }
  }
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default middleware
