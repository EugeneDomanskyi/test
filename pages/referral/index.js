import { useCallback, useEffect, useState } from 'react'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const Referral = () => {
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState()
  const [form, setForm] = useState({email: '', referenceID: '', dev: true})

  useEffect(() => {
    const json = localStorage.getItem('referral_form')
    if (json) {
      const data = JSON.parse(json)
      if (!data.hasOwnProperty('dev')) {
        data.dev = true
      }
      setForm(data)
    }

    window.addEventListener('message', messageCallback)

    return () => {
      window.removeEventListener('message', messageCallback)
    }
  }, [])

  const messageCallback = useCallback(async (event) => {
    if (event.data.action === 'refreshToken') {
      fetchUrl()
    }

    if (event.data.action === 'heightChange') {
      document.getElementById('payramIframe').style.height = event.data.payload + 'px';
    }

    if (event.data.action === 'requestClipboard') {
      try {
        const text = await navigator.clipboard.readText();
        event.source.postMessage({ clipboard: text }, event.origin);
      } catch (err) {
        console.error("Clipboard read failed in parent:", err);
      }
    }
  }, [url])

  const fetchUrl = async () => {
    if (form.email !== '' && form.referenceID !== '') {
      const result = await $app.api.payram(form)
      if (result && result?.redirectURL) {
        let url = result.redirectURL
        if (window.location.origin === 'http://localhost:3000') {
          url = url.replace('https://payram.resuefas.vip', 'http://localhost')
        }
        setUrl(url)

        localStorage.setItem('referral_form', JSON.stringify(form))
      }

      setLoading(false)
    }
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      {loading ? (
        <App.Flex column center>
          <App.Flex column gap={16} width={300} height={400} center>
            <App.Flex row fullWidth align="center" justify="space-between">
              <App.Checkbox
                checked={form.dev}
                label="Develop"
                onChange={(checked) => { setForm({...form, dev: checked}) }}
              />

              <App.Checkbox
                checked={!form.dev}
                label="Pre-Prod"
                onChange={(checked) => { setForm({...form, dev: !checked}) }}
              />
            </App.Flex>

            <App.TextField
              label="Email"
              placeholder="Email"
              value={form.email}
              onChange={(value) => { setForm({...form, email: value}) }}
              onSubmit={fetchUrl}
            />

            <App.TextField
              label="Reference ID"
              placeholder="Reference ID"
              value={form.referenceID}
              onChange={(value) => { setForm({...form, referenceID: value}) }}
              onSubmit={fetchUrl}
            />

            <App.Button primary2 fullWidth onClick={fetchUrl}>Submit</App.Button>
          </App.Flex>
        </App.Flex>
      ) : (
        url ? (
          <iframe id="payramIframe" src={url} style={{ width: '100%', minHeight: '100%'}} allow="clipboard-read; clipboard-write"></iframe>
        ) : (
          <App.Flex column center heiht={300}>
            <App.Text>Oops. Something went wrong. Try it later</App.Text>
          </App.Flex>
        )

      )}
    </App.Flex>
  )
}

export default Referral