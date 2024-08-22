import { useEffect } from 'react'

import App from '@/components/App'

const Bot  = () => {
  useEffect(() => {
    // Dynamically load the Telegram WebApp SDK
    const loadTelegramSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram?.WebApp) {
          // Expand the web app to full height
          window.Telegram.WebApp.expand();

          // Access theme parameters and apply them
          const themeParams = window.Telegram.WebApp.themeParams;
          document.body.style.backgroundColor = themeParams.bg_color || '#FFFFFF';
          document.body.style.color = themeParams.text_color || '#000000';
        }
      };
      document.head.appendChild(script);
    };

    loadTelegramSDK();
  }, [])

  return (
    <App.Flex>
      Hello
    </App.Flex>
  )
}

export default Bot