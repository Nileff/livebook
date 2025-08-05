import { apiFetch } from './apiFetch'
import { CookieAdapter } from './cookie'


export type User = {
  id?: number | null
  name?: string | null
  authorized: boolean
  refresh?: boolean
  [key: string]: unknown
}

export async function getAuthUser(locale: string, cookies: CookieAdapter): Promise<User> {
  try {
    if (cookies.get('access_token_exist')) {
      const { data } = await apiFetch('/auth/verify/', undefined, locale)
      return data as User
    } else if (cookies.get('refresh_token_exist')) {
      const isServer = typeof window === 'undefined'
      if (!isServer) {
        const { data } = await apiFetch('/auth/refresh/', undefined, locale)
        return data as User
      }
      return { authorized: false, refresh: true }
    }
    return { authorized: false }
  } catch {
    return { authorized: false }
  }
}

export async function logout(): Promise<User> {
  try {
    const { data } = await apiFetch('/auth/logout/', undefined)
    return data as User
  } catch {
    return { authorized: false }
  } finally {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('logout'))
    }
  }
}
