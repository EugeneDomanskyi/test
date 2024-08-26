import crypto from 'crypto'

class TelegramBot {
  app: any
  initData: string

  isBot = () => {
    return this.app !== undefined
  }

  getInitData = () => {
    //return 'query_id=AAEfkDliAAAAAB-QOWLyvY6G&user=%7B%22id%22%3A1647939615%2C%22first_name%22%3A%22Eugene%F0%9F%A6%B4%22%2C%22last_name%22%3A%22Domanskyi%22%2C%22username%22%3A%22ievgenii_domanskyi%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724317098&hash=665570655d38e6e47102e7963fbf272e875600659397f7c2fcccf772ded8ffe1'
    
    if (typeof window !== 'undefined' && (window as any)?.Telegram?.WebApp) {
      this.initData = (window as any).Telegram.WebApp.initData
      return this.initData
    }

    return null
  }

  init = () => {
    const isTelegramUser = this.validateInitData(this.getInitData())
    if (isTelegramUser) {
      if ((window as any)?.Telegram?.WebApp) {
        this.app = (window as any).Telegram.WebApp

        this.app.expand()
        this.app.setHeaderColor('#08051C')
        this.app.disableVerticalSwipes()

        return true
      }
    }

    return false
  }

  validateInitData = (initData: string) => {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    const authDataArray: string[] = [];
    params.forEach((value, key) => {
      if (key !== 'hash') {
        authDataArray.push(`${key}=${value}`);
      }
    })

    const authData = authDataArray.sort().join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN).digest()
    const generatedHash = crypto.createHmac('sha256', secretKey).update(authData).digest('hex')
    return generatedHash === hash
  }

  openInvoice = (invoice: any, callback: (status: string) => {}) => {
    if (this.app) {
      this.app.openInvoice(invoice, callback)
    }
  }

  showPopup = (title: string, message: string, buttons?: Array<{id?: string, type?: string, text?: string}>) => {
    if (this.app) {
      this.app.showPopup({title, message, buttons})
    }
  }

  openLink = (url: string) => {
    if (this.app) {
      this.app.openLink(url)
    }
  }

  on = (event: string, callback: (data: any) => {}) => {
    if (this.app) {
      this.app.onEvent(event, callback)
    }
  }
}

export default new TelegramBot()