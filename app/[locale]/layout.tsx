import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Alegreya, Inter, Noto_Sans } from 'next/font/google'

import '@/styles/globals.scss'

const alegreya = Alegreya({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: ['700'],
  style: ['normal'],
  variable: '--font-alegreya',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  variable: '--font-inter',
  display: 'swap',
})
const noto = Noto_Sans({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-noto-sans',
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
    <html lang={locale} className={`${alegreya.variable} ${inter.variable} ${noto.variable}`}>
      <NextIntlClientProvider>
        {children}
      </NextIntlClientProvider>
    </html>
  )
}

export default LocaleLayout
