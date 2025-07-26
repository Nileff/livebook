const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
const API_PATH = process.env.NEXT_PUBLIC_API_PATH ?? ''
const PROXY = process.env.NEXT_PUBLIC_PROXY === 'true'

export function buildUrl(url: string, isProxy: boolean) {
  if(/^https?:\/\//.test(url)) {
    return url
  }

  const domain = PROXY === isProxy ? API_DOMAIN.replace(/\/+$/, '') : ''
  const path = API_PATH.replace(/^\/+|\/+$/g, '')
  const cleanUrl = url.replace(/^\/+|\/+$/g, '')

  let fullUrl = domain

  if(path) {
    fullUrl += `/${path}`
  }
  if(cleanUrl) {
    fullUrl += `/${cleanUrl}`
  }

  return fullUrl + '/'
}
