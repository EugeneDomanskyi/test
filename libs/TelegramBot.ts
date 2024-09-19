import crypto from 'crypto'

class TelegramBot {
  app: any
  initData: string

  isBot = () => {
    return this.app !== undefined
  }

  getInitData = () => {
    // return 'query_id=AAEfkDliAAAAAB-QOWLyvY6G&user=%7B%22id%22%3A1647939615%2C%22first_name%22%3A%22Eugene%F0%9F%A6%B4%22%2C%22last_name%22%3A%22Domanskyi%22%2C%22username%22%3A%22ievgenii_domanskyi%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724317098&hash=665570655d38e6e47102e7963fbf272e875600659397f7c2fcccf772ded8ffe1'
    // return 'query_id=AAEfkDliAAAAAB-QOWLrWEts&user=%7B%22id%22%3A1647939615%2C%22first_name%22%3A%22Eugene%F0%9F%A6%B4%22%2C%22last_name%22%3A%22Domanskyi%22%2C%22username%22%3A%22ievgenii_domanskyi%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726580040&hash=1c31b725421db020fead18da41f0e61010fe65b54b353a6958189f4694d41961'
    
    // Akash' initialData:
    // return 'query_id=AAGY1a9VAgAAAJjVr1WDHPT6&user=%7B%22id%22%3A5732554136%2C%22first_name%22%3A%22Ryu%20%7C%20Tegro%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ryu_tegro%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726757476&hash=a7e0a4e9ac54c3f14d75dc416d86b9d49c7ed8964bb17483023f2c892cb0889c'
    
    // Suryansh initialData:
    // return 'query_id=AAFhnR1EAAAAAGGdHUSndwz_&user=%7B%22id%22%3A1142791521%2C%22first_name%22%3A%22Suryansh%22%2C%22last_name%22%3A%22Chandak%22%2C%22username%22%3A%22atheistc137%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726119372&hash=f8f2c83717a4ee464b0d6a59128a2d0a8d2030aa1d56dd6b408a9148efe93fdc'

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

  getUsername = () => {
    const initData = this.getInitData()
    const params = new URLSearchParams(initData);

    // Get the encoded user field
    const encodedUser = params.get('user');
    if (!encodedUser) {
      return null;
    }

    // Decode the user field
    const decodedUser = decodeURIComponent(encodedUser);

    // Parse the decoded user field as JSON
    let user = null;
    try {
      user = JSON.parse(decodedUser);
    } catch (error) {
      console.error('Failed to parse user JSON:', error);
      return null;
    }

    // Extract and return the username
    return user.username || null;
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

  openTelegramLink = (url: string) => {
    if (this.app) {
      this.app.openTelegramLink(url)
    }
  }

  backButton = (show: boolean, callback: () => {}) => {
    if (this.app) {
      if (show) {
        this.app.BackButton.show()
        this.app.BackButton.onClick(callback)
      } else {
        this.app.BackButton.offClick(callback)
        this.app.BackButton.hide()
      }
    }
  }

  on = (event: string, callback: (data: any) => {}) => {
    if (this.app) {
      this.app.onEvent(event, callback)
    }
  }

  host = () => {
    let host = window.location.hostname
    if (window.location.hostname == 'localhost') {
      host = 'beta.tegro.com'
    }

    if (window.location.hostname == 'nft20-git-production-toraverse.vercel.app') {
      host = 'tegro.com'
    }

    return host
  }

  domain = () => {
    switch (this.host()) {
      case 'tegro.com': return 'tegro_fi_bot'
      case 'testnet.tegro.com': return 'testnet_tegro_bot'
      default: return 'local_tegro_bot'
    }
  }
}

export default new TelegramBot()