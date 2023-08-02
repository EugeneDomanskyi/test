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

export const trackEvent = (eventName, eventProperties) => {
  /* const data = {
    ...eventProperties,
    IsBrowser: true,
    OS: getOS(),
    Device: getDevice(),
  }
  Intercom.trackEvent(eventName, data)
  const post = {
    device_id: localStorage.getItem('device_id'),
    event_type: eventName,
    event_properties: data,
  }
  amplitudeEventTrack(post) */
  const [subDomain] = window.location.hostname.split('.')
  const data = {
    ...eventProperties,
    IsBrowser: true,
    OS: getOS(),
    Device: getDevice(),
    Source: `${subDomain.charAt(0).toUpperCase()}${subDomain.slice(1)}`,
  }
  amplitude.getInstance().logEvent(eventName, data)
}

export const amplitudeEventTrack = (post) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY
  }
  const payload = {
    ...post,
    services:  ['amplitude', 'intercom', 'redshift']
  }

  return fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_URL}/users/events/track`, {method: 'POST', body: JSON.stringify(payload), headers: headers})
}