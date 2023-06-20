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

    if (icon == 'check-circle-fill') {
      return (
        <svg width={width ?? 33} height={height ?? 33} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill={color ?? '#53F19C'} d="M0.5 16.3585C0.5 7.52102 7.6625 0.358521 16.5 0.358521C25.3375 0.358521 32.5 7.52102 32.5 16.3585C32.5 25.196 25.3375 32.3585 16.5 32.3585C7.6625 32.3585 0.5 25.196 0.5 16.3585ZM23.7375 13.596C24.4187 12.9148 24.4187 11.8023 23.7375 11.121C23.0562 10.4398 21.9438 10.4398 21.2625 11.121L14.5 17.8835L11.7375 15.121C11.0563 14.4398 9.94375 14.4398 9.2625 15.121C8.58125 15.8023 8.58125 16.9148 9.2625 17.596L13.2625 21.596C13.9437 22.2773 15.0563 22.2773 15.7375 21.596L23.7375 13.596Z" />
        </svg>
      )
    }
  }

  return getIcon()
}

export default AppIcon