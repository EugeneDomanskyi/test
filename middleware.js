import { NextResponse } from 'next/server'

const middleware = async (req) => {
  const url = req.nextUrl.clone()
  const { pathname } = req.nextUrl
  const segments = pathname.split('/').filter(segment => segment !== '')
  if (!segments.length) {
    url.pathname = `/nfts`
    return NextResponse.redirect(url)
  }
}

export default middleware