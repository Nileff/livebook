'use client'

import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { useState } from 'react'
import { logout } from '@/lib/auth'

import Logo from '../Logo'

import styles from './index.module.scss'
import { Link } from '@/i18n/navigation'
import { useAuthContext } from '@/provider/auth'


const MainHeader = () => {
  const t = useTranslations('Meta')
  const m = useTranslations('Menu')
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useAuthContext()

  return (
    <header className={styles.root}>
      <Link className={styles.mainLink} href="/">
        <Logo className={styles.logo}/>
        <div className={styles.name}>
          {t('nameSplit')}
        </div>
      </Link>
      <nav className={clsx(styles.navigation, 'desktop')}>
        {['book', 'author', 'genre'].map((item) => (
          <Link key={item} href={`/${item}`}>{m(item)}</Link>
        ))}
      </nav>
      {
        user?.authorized && (
          <div className={clsx(styles.button, 'desktop')} onClick={logout}>
            {m('logout')}
          </div>
        )
      }
      {
        !user?.authorized && (
          <div className={clsx(styles.groupLogin, 'desktop')}>
            <Link className={styles.button} href="/login">{m('login')}</Link>
            <Link className={styles.button} href="/register">{m('reg')}</Link>
          </div>
        )
      }
      <div className={clsx(styles.burgerMenu, open && styles.open, 'mobile')}>
        <div className={styles.burger} onClick={() => setOpen(true)}>
          <span />
        </div>
        <div className={styles.menuPanel}>
          <Link className={styles.mainLink} href="/">
            <Logo className={styles.logo}/>
            <div className={styles.name}>
              {t('nameSplit')}
            </div>
          </Link>
          <div className={styles.close} onClick={() => setOpen(false)} />
          <nav className={styles.navigation}>
            {['book', 'author', 'genre'].map((item) => (
              <Link key={item} href={`/${item}`}>{m(item)}</Link>
            ))}
          </nav>
          {
            user?.authorized && (
              <div className={styles.button} onClick={logout}>
                {m('logout')}
              </div>
            )
          }
          {
            !user?.authorized && (
              <div className={styles.groupLogin}>
                <Link className={styles.button} href="/login">{m('login')}</Link>
                <Link className={styles.button} href="/register">{m('reg')}</Link>
              </div>
            )
          }
        </div>
      </div>
    </header>
  )
}

export default MainHeader
