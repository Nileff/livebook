import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { getAuthUser } from '@/lib/auth'
import { cookieAdapter } from '@/lib/cookie'
import { AuthProvider } from '@/provider/auth'

import AuthHeader from '@/components/AuthHeader'

import styles from './layout.module.scss'

const AuthLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> => {
  const { locale } = await params
  const allCookies = await cookies()
  const user = await getAuthUser(locale, cookieAdapter(allCookies))

  return (
    <body className={styles.body}>
      <AuthProvider user={user} layoutType="auth">
        <AuthHeader/>
        {children}
      </AuthProvider>
    </body>
  )
}

export default AuthLayout
