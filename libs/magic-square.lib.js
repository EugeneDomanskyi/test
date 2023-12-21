export const tradeVolumeCheck = async (address) => {
  const vid = localStorage.getItem('ms_vid')
  const headers = {
    "Content-Type": "application/json",
  }

  if (vid) {
    try {
      const post = {
        wallet_address: address,
        vid: vid
      }
      fetch(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/magic_square_trade_volume_check`, { method: 'POST', body: JSON.stringify(post), headers })
    } catch (err) {
      console.log('err', err);
    }
  }
}

export const connectWalletVid = async address => {
  const vid = localStorage.getItem('ms_vid')
  const headers = {
    "Content-Type": "application/json",
  }
  if (vid && address) {
    const post = {
      wallet_address: address,
      vid: vid
    }
    fetch(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/connect-wallet-vid`, { method: 'POST', body: JSON.stringify(post), headers})
  }
}