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
  }

  return getIcon()
}

export default AppIcon