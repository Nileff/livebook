import { getCurrentOrigin, getCookies } from '@/lib/fetchHelpers'


const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
const API_PATH = process.env.NEXT_PUBLIC_API_PATH ?? ''
const PROXY = process.env.NEXT_PUBLIC_PROXY === 'true'

const refreshUrl = process.env.NEXT_PUBLIC_REFRESH_URL
type ApiBody = BodyInit | object | null

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: ApiBody
}

export async function buildUrl(url: string, isProxy: boolean) {
  if(/^https?:\/\//.test(url)) {
    return url
  }

  const domain = PROXY === isProxy ? API_DOMAIN.replace(/\/+$/, '') : await getCurrentOrigin()
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

export async function apiFetch(url: string, options: ApiFetchOptions = {}, locale: string) {
  const fullUrl = await buildUrl(url, false)
  const { body, headers: incomingHeaders, ...rest } = options
  const isServer = typeof window === 'undefined'

  const headers = new Headers(incomingHeaders)
  headers.set('Accept-Language', locale)

  if (isServer) {
    const cookieHeader = await getCookies()
    headers.set('Cookie', cookieHeader)
  }

  let finalBody: BodyInit | undefined

  if(body == null) {
    finalBody = undefined
  } else if(typeof body === 'string') {
    finalBody = body
    if(!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  } else if(body instanceof FormData ||
    body instanceof ReadableStream ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    finalBody = body
  } else if(body instanceof URLSearchParams) {
    finalBody = body
    if(!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
    }
  } else if(body instanceof Blob) {
    finalBody = body
    if(!headers.has('Content-Type') && body.type) {
      headers.set('Content-Type', body.type)
    }
  } else if(typeof body === 'object') {
    finalBody = JSON.stringify(body)
    if(!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  } else {
    finalBody = body as BodyInit
  }

  const fetchOptions: RequestInit = {
    ...rest, credentials: 'include', headers, body: finalBody,
  }

  const tryFetch = async (): Promise<Response> => {
    return await fetch(fullUrl, fetchOptions)
  }

  let res = await tryFetch()

  if (!isServer && refreshUrl && res.status === 401 && !url.includes(refreshUrl)) {
    const fullRefreshUrl = await buildUrl(refreshUrl, false)
    const refreshRes = await apiFetch(fullRefreshUrl, { method: 'GET', credentials: 'include' }, locale)

    if (refreshRes.status === 200) {
      res = await tryFetch()
    } else {
      throw new Error('Refresh token failed')
    }
  }

  if(!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const contentType = res.headers.get('content-type') || ''

  let data
  if(contentType.includes('application/json')) {
    data = await res.json()
  } else if(contentType.includes('text/')) {
    data = await res.text()
  } else if(
    contentType.includes('application/octet-stream') ||
    contentType.includes('application/pdf') ||
    contentType.includes('image/')
  ) {
    data = await res.blob()
  } else {
    data = await res.text()
  }

  return { data, status: res.status }
}
