import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'


export interface CookieAdapter {
  get(name: string): string | undefined
}

export function cookieAdapter(input: ReadonlyRequestCookies | string): CookieAdapter {
  if (typeof input === 'string') {
    const parsed = input
      .split('; ')
      .map(c => c.split('='))
      .reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = decodeURIComponent(value || '')
        return acc
      }, {})

    return {
      get: (name) => parsed[name],
    }
  }

  return {
    get: (name) => input.get(name)?.value,
  }
}
