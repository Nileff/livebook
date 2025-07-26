import { useTranslations } from 'next-intl'

import Login from '@/forms/Login'


import styles from './page.module.scss'


const LoginPage = () => {
  const t = useTranslations('Auth')

  return (
    <div className={styles.login}>
      <h1>{t('auth')}</h1>
      <Login />
    </div>
  )
}

export default LoginPage
