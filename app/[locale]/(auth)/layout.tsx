import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Logo from '@/components/Logo'

import '@/app/globals.scss'
import styles from './layout.module.scss'


const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  variable: '--font-inter',
  display: 'swap',
})

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta' })

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      shortcut: '/icon.svg',
    },
    manifest: `/${locale}.manifest.webmanifest`,
  }
}

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> => {

  const { locale } = await params
  if(!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} className={`${inter.variable}`}>
      <body className={styles.body}>
        <Logo size={120}/>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
