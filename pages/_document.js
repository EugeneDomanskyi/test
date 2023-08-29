import Document, { Html, Head, Main, NextScript } from 'next/document'

import GoogleAnalytics from '@/components/GoogleAnalytics'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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