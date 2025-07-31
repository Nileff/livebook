import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { getAuthUser } from '@/lib/auth'
import { cookieAdapter } from '@/lib/cookie'
import { AuthProvider } from '@/provider/auth'

import Logo from '@/components/Logo'

import styles from './layout.module.scss'

const PrivateLayout = async ({
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
    <body>
      <header className={styles.header}>
        <Logo size={80}/>
        test
      </header>
      <AuthProvider user={user} layoutType="main">
        {children}
      </AuthProvider>
    </body>
  )
}

export default PrivateLayout
