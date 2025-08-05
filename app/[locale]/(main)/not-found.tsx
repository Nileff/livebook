'use client'

import { useTranslations } from 'next-intl'
import styles from './error.module.scss'

export default function NotFound() {
  const t = useTranslations('Error')
  return (
    <div className={styles.error}>
      <div className={styles.code}>
        404
      </div>
      <div className={styles.message}>
        {t('404')}
      </div>
    </div>
  )
}
