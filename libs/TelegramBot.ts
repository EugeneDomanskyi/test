import crypto from 'crypto'

class TelegramBot {
  app: any
  initData: string

  getInitData = () => {
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

  showPopup = (title: string, message: string) => {
    if (this.app) {
      this.app.showPopup({title, message})
    }
  }
}

export default new TelegramBot()