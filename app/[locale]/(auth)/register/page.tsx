import { useTranslations } from 'next-intl'

import Register from '@/forms/Register'

import styles from './page.module.scss'


const RegisterPage = () => {
  const t = useTranslations('Auth')

  return (
    <div className={styles.register}>
      <h1>{t('reg')}</h1>
      <Register />
    </div>
  )
}

export default RegisterPage
