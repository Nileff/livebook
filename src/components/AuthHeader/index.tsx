import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import Logo from '../Logo'

import styles from './index.module.scss'


const AuthHeader = () => {
  const t = useTranslations('Meta')
  return (
    <header className={styles.root}>
      <Link href="/">
        <Logo className={styles.logo}/>
      </Link>
      <div className={styles.name}>
        {t('name')}
      </div>
    </header>
  )
}

export default AuthHeader
