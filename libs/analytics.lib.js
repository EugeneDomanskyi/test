import amplitude from 'amplitude-js'

export const getOS = () => {
  let userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
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

export const getDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /iPhone|Android/i.test(navigator.userAgent)
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent)
  if (isMobile) {
    return 'Mobile'
  } else if (isTablet){
    return 'Tablet'
  }
  return 'Desktop'
}

export const getPageName = () => {
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

  return window.location.pathname
}

export const trackEvent = (eventName, eventProperties) => {
  const data = {
    ...eventProperties,
    IsBrowser: true,
    OS: getOS(),
    Device: getDevice(),
  }
  amplitude.getInstance().logEvent(eventName, data)
}