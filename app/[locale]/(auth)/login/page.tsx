import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import Login from '@/forms/Login'

import styles from './page.module.scss'


const LoginPage = () => {
  const t = useTranslations('Auth')

  return (
    <div className={styles.root}>
      <h1>{t('auth')}</h1>
      <Login />
      <Link className={styles.link} href="/register">{t('reg')}</Link>
    </div>
  )
}

export default LoginPage
