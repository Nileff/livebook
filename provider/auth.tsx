'use client'

import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { User, getAuthUser } from '@/lib/auth'
import { cookieAdapter } from '@/lib/cookie'


type Status = 'init' | 'refresh' | 'loading' | 'authorized' | 'unauthorized'
type LayoutType = 'auth' | 'private' | 'main'

type AuthContextValue = {
  user?: User | null
  setUser: (user: User) => void
  status: Status
  setStatus: (status: Status) => void
}

const AuthContext = createContext<AuthContextValue>({
  setUser: () => {},
  status: 'loading',
  setStatus: () => {},
})

export function AuthProvider({
  user: initialUser,
  layoutType,
  children,
}: {
  user: User
  layoutType: LayoutType
  children: ReactNode
}) {
  const [user, setUser] = useState<User>(initialUser)
  const [status, setStatus] = useState<Status>('init')

  useEffect(() => {
    const handleLogout = () => {
      setUser({ authorized: false })
      setStatus('unauthorized')
    }
    window.addEventListener('logout', handleLogout)
    return () => window.removeEventListener('logout', handleLogout)
  }, [])

  useEffect(() => {
    if (user.refresh) {
      setStatus('refresh')
    } else if (user.authorized) {
      setStatus('authorized')
    } else if (!user.authorized) {
      setStatus('unauthorized')
    }
  }, [user])

  const { push } = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (status === 'refresh') {
      setStatus('loading')
      getAuthUser(locale, cookieAdapter(document.cookie)).then(setUser)
    }
  }, [status, locale])

  useEffect(() => {
    if (['init', 'refresh', 'loading'].includes(status)) return

    if (!user && layoutType === 'private') {
      push(`/${locale}`)
    }

    if (user && layoutType === 'auth') {
      push(`/${locale}`)
    }
  }, [status, user, layoutType, locale, push])

  return (
    <AuthContext.Provider value={{ user, setUser, status, setStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
