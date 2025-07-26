import { buildUrl } from '@/lib/buildUrl'


const refreshUrl = process.env.NEXT_PUBLIC_REFRESH_URL
type ApiBody = BodyInit | object | null

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: ApiBody
}

export async function apiFetch(url: string, options: ApiFetchOptions = {}, locale: string) {
  const fullUrl = buildUrl(url, false)
  const { body, headers: incomingHeaders, ...rest } = options

  const headers = new Headers(incomingHeaders)
  headers.set('Accept-Language', locale)

  let finalBody: BodyInit | undefined = undefined

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

  if (refreshUrl && res.status === 401 && !url.includes(refreshUrl)) {
    const fullRefreshUrl = buildUrl(refreshUrl, false)
    const refreshRes = await fetch(fullRefreshUrl, { method: 'GET', credentials: 'include' })

    if (refreshRes.ok) {
      res = await tryFetch()
    } else {
      throw new Error('Refresh token failed')
    }
  }

  if(!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const contentType = res.headers.get('content-type') || ''

  if(contentType.includes('application/json')) {
    return res.json()
  } else if(contentType.includes('text/')) {
    return res.text()
  } else if(
    contentType.includes('application/octet-stream') ||
    contentType.includes('application/pdf') ||
    contentType.includes('image/')
  ) {
    return res.blob()
  } else {
    return res.text()
  }
}
