'use client'

import styles from './error.module.scss'


export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className={styles.error}>
      <div className={styles.message}>
        {error?.message}
      </div>
    </div>
  )
}
