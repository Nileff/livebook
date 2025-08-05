import { useLocale } from 'next-intl'
import { apiFetch, ApiFetchOptions } from '@/lib/apiFetch'


export function useFetch() {
  const locale = useLocale()

  function callGet(url: string, init?: ApiFetchOptions) {
    return apiFetch(url, { ...init, method: 'GET' }, locale)
  }

  function callPost(url: string, init?: ApiFetchOptions) {
    return apiFetch(url, { ...init, method: 'POST' }, locale)
  }

  function callPut(url: string, init?: ApiFetchOptions) {
    return apiFetch(url, { ...init, method: 'PUT' }, locale)
  }

  function callPatch(url: string, init?: ApiFetchOptions) {
    return apiFetch(url, { ...init, method: 'PATCH' }, locale)
  }

  function callDelete(url: string, init?: ApiFetchOptions) {
    return apiFetch(url, { ...init, method: 'DELETE' }, locale)
  }

  return { callGet, callPost, callPut, callPatch, callDelete }
}
