import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import Register from '@/forms/Register'

import styles from './page.module.scss'


const RegisterPage = () => {
  const t = useTranslations('Auth')

  return (
    <div className={styles.root}>
      <h1>{t('reg')}</h1>
      <Register />
      <Link className={styles.link} href="/login">{t('auth')}</Link>
    </div>
  )
}

export default RegisterPage
