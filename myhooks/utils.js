const useUtils = () => {
  const s3File = (name, sufix = '_256', ext = 'png') => {
    return `${process.env.NEXT_PUBLIC_S3_URL}/NFT-20/${name}${sufix ?? ''}.${ext}`
  }

  const formatWithPrecision = (number, precision = 6, includeDecimalZeros = 0, fillWithZeros = false) => {
    if (typeof (number * 1) == 'number') {
      const [integer, decimal = ''] = number.toString().split('.')
      let precisionDecimal = decimal.slice(0, precision)

      if (fillWithZeros && precisionDecimal.length < precision) {
        precisionDecimal = precisionDecimal.padEnd(precision, '0')
      }

      if (includeDecimalZeros > 0 && precisionDecimal == '') {
        precisionDecimal = precisionDecimal.padEnd(includeDecimalZeros, '0')
      }
      
      return integer + (precisionDecimal != '' ? ('.' + precisionDecimal) : '')
    }

    return number
  }

  return { s3File, formatWithPrecision }
}

export default useUtils