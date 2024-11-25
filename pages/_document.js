import Document, { Html, Head, Main, NextScript } from 'next/document'

import GoogleAnalytics from '@/components/GoogleAnalytics'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="canonical" href="https://www.tegro.com" />
          <GoogleAnalytics />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
