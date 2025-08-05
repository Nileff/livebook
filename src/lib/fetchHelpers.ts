'use server'
import { headers, cookies } from 'next/headers'

export async function getCurrentOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto')

  if (!host || !protocol) {
    throw new Error('Unable to get current origin')
  }

  return `${protocol}://${host}`
}

export async function getCookies() {
  return (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')
}
