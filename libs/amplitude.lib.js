import amplitude from 'amplitude-js'

class Amplitude {
  constructor () {
    this.initialized = false
    this.isBrowser = false
  }

  init = (apiKey, isBrowser, platform) => {
    if (!this.initialized) {
      amplitude.getInstance().init(apiKey, null, { platform })
      this.isBrowser = isBrowser
      this.initialized = true
    }
  }

  identify = (address, idField = 'wallet') => {
    const identifyObj = new amplitude.Identify()
    identifyObj.set(idField, address.toLowerCase())
    amplitude.identify(identifyObj)
    amplitude.getInstance().setUserId(address.toLowerCase())
  }

  utm = (params) => {
    amplitude.getInstance().setUserProperties(params)
  }

  os = () => {
    let userAgent = typeof window != 'undefined' ? window.navigator.userAgent : null,
        platform = typeof window != 'undefined' ? window.navigator.platform : null,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os
  }

  device = () => {
    const userAgent = typeof navigator != 'undefined' ? navigator.userAgent.toLowerCase() : null
    const isMobile = typeof navigator != 'undefined' ? /iPhone|Android/i.test(navigator.userAgent) : null
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent) 
    if (isMobile) {
      return 'Mobile'
    } else if (isTablet){
      return 'Tablet'
    }
    return 'Desktop'
  }

  page = () => {
    if (window.location.pathname == '/') {
      return 'Homepage'
    }
  
    if (window.location.pathname.includes('exchange')) {
      return 'Exchange'
    }
  
    if (window.location.pathname.includes('earn')) {
      return 'Earn'
    }
  
    if (window.location.pathname.includes('market')) {
      return 'Market Page'
    }
  
    if (window.location.pathname.includes('nfts')) {
      return 'NFT'
    }
  
    if (window.location.pathname.includes('swap')) {
      return 'NFT Swap'
    }
  
    if (window.location.pathname.includes('campaign')) {
      return 'Campaign Landing'
    }
  
    if (window.location.pathname.includes('gems-dashboard')) {
      return 'Gems'
    }

    if (window.location.pathname.includes('auctions')) {
      return 'Earn'
    }

    if (window.location.pathname.includes('/bot/claim')) {
      return 'Auction Checkout'
    }

    if (window.location.pathname.includes('/bot')) {
      return 'Auction Mini App'
    }
  
    if (window.location.pathname.includes('tournaments')) {
      return 'Tournament'
    }
  
    return window.location.pathname
  }

  event = (name, props) => {
    const data = {
      ...props,
      IsBrowser: this.isBrowser,
      OS: this.os(),
      Device: this.device(),
      Source: props?.Source ? props.Source : 'Web',
      Domain: typeof window != 'undefined' ? window.location.hostname : null
    }
    amplitude.getInstance().logEvent(name, data)
  }
}

export default new Amplitude()