declare global {
  interface Window {
    appDataHandler?: (data: any) => void
  }
}

class AppHelper {
  debugMode: boolean = true
  isApp: boolean = false

  init = (isApp: boolean, callback: (data: any) => void) => {
    if (isApp) {
      this.isApp = isApp

      if (typeof window != 'undefined') {
        if (!window.appDataHandler) {
          window.appDataHandler = callback
        }
      }
    }
  }

  send = (data: any) => {
    if (this.isApp) {
      if (window?.ReactNativeWebView && window?.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data))
      }
    }
  }

  log = (...args: Array<any>) => {
    this.send({ log: args })
  }

  error = (...args: any[]) => {
    if (this.debugMode) {
      console.log(`!!! ${this.constructor.name} ->`, ...args)
    }
  }

  debug = (...args: any[]) => {
    if (this.debugMode) {
      console.log(`--- ${this.constructor.name} ->`, ...args)
    }
  }
}

export default new AppHelper()