const GoogleAnalytics = () => {
  const gaId = 'G-7W1E3B1G5T' // Prod GA ID
  return (
    <>
      <script async defer src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics