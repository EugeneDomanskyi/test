const useUtils = () => {
  const s3File = (name, sufix = '_256', ext = 'png') => {
    return `${process.env.NEXT_PUBLIC_S3_URL}/NFT-20/${name}${sufix ?? ''}.${ext}`
  }

  return { s3File }
}

export default useUtils