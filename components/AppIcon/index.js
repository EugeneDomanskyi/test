const AppIcon = ({ icon, width, height, color, opacity, ...props }) => {
  const getIcon = () => {
    if (icon == 'logo') {
      return (
        <svg width={width ?? 10} height={height ?? 24} viewBox="0 0 10 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill={color ?? '#121212'} d="M4.19.863a1 1 0 01.973.77l4.81 20.385A1 1 0 019 23.248H5.854a1 1 0 01-.973-.771L.07 2.093a1 1 0 01.973-1.23H4.19z" />
        </svg>
      )
    }

    if (icon == 'cross') {
      return (
        <svg width={width ?? 16} height={height ?? 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path fill={color ?? '#8376BD'} d="m9.326 8 5.9-5.9A.938.938 0 1 0 13.898.776L8 6.675 2.1.774A.938.938 0 1 0 .776 2.1L6.675 8l-5.9 5.9A.938.938 0 1 0 2.1 15.224L8 9.325l5.9 5.9a.938.938 0 1 0 1.325-1.326L9.325 8Z" />
        </svg>
      )
    }

    if (icon == 'copy') {
      return (
        <svg width={width ?? 24} height={height ?? 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <rect stroke={color ?? '#8176B8'} width="14.006" height="14.006" x="6.998" y="6.998" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" rx="2"></rect>
          <path stroke={color ?? '#8176B8'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.998 17.002H4.997a2 2 0 01-2-2V4.996a2 2 0 012-2H15a2 2 0 012 2v2"></path>
        </svg>
      )
    }

    if (icon == 'lock-star-fill') {
      return (
        <svg width={width ?? 25} height={width ?? 25} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill={color ?? '#53F19C'} d="M11.394 1.03c.828-.707 2.183-.707 3.023 0l1.896 1.633c.36.312 1.031.563 1.511.563h2.04a2.324 2.324 0 012.315 2.316v2.04c0 .467.252 1.151.564 1.511l1.632 1.895c.707.828.707 2.184 0 3.024l-1.632 1.895c-.312.36-.564 1.032-.564 1.512v2.04a2.324 2.324 0 01-2.315 2.315h-2.04c-.468 0-1.152.252-1.512.564l-1.895 1.631c-.828.708-2.184.708-3.023 0l-1.896-1.631c-.36-.312-1.032-.564-1.511-.564H5.91a2.324 2.324 0 01-2.315-2.316v-2.051c0-.468-.252-1.14-.552-1.5L1.424 14c-.696-.828-.696-2.172 0-3l1.62-1.907c.3-.36.552-1.032.552-1.5V5.542A2.324 2.324 0 015.91 3.226h2.076c.467 0 1.151-.251 1.511-.563l1.896-1.632z" />
          <path fill="#06382F" d="M16.38 10.91v-.829a3.48 3.48 0 00-3.475-3.476 3.48 3.48 0 00-3.476 3.476v.829a1.66 1.66 0 00-1.21 1.59v4.23c0 .92.744 1.663 1.663 1.663h6.045c.919 0 1.663-.743 1.663-1.662v-4.232c0-.755-.514-1.39-1.21-1.59zM12.906 8.72c.75 0 1.36.61 1.36 1.36v.756h-2.72v-.756c0-.75.61-1.36 1.36-1.36zm.453 6.54v.865a.457.457 0 01-.453.454.457.457 0 01-.454-.454v-.864a1.054 1.054 0 01-.604-.95c0-.58.477-1.057 1.058-1.057.58 0 1.058.477 1.058 1.058 0 .423-.248.78-.605.949z" />
        </svg>
      )
    }

    if (icon == 'arrow-down') {
      return (
        <svg width={width ?? 17} height={height ?? 16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path stroke={color ?? '#605884'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" d="M8.902 3.332v9.333M13.569 8l-4.667 4.667L4.235 8" />
        </svg>
      )
    }

    if (icon == 'arrow-right') {
      return (
        <svg width={width ?? 24} height={height ?? 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path stroke={color ?? '#fff'} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83" />
        </svg>
      )
    }

    if (icon == 'chevron-left') {
      return (
        <svg width={width ?? 16} height={height ?? 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path stroke={color ?? '#B9B8C5'} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M10 13.279L5.654 8.932a1.324 1.324 0 010-1.867L10 2.72" />
        </svg>
      )
    }
  }

  return getIcon()
}

export default AppIcon