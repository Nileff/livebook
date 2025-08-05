'use client'

import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useFetch } from '@/hook/useFetch'
import { useAuthContext } from '@/provider/auth'

interface IRegisterFormInput {
  email: string
  password: string
}


const Register = () => {
  const t = useTranslations('Auth')
  const { register, handleSubmit } = useForm<IRegisterFormInput>()
  const { callPost } = useFetch()
  const { setStatus, setUser } = useAuthContext()
  const onSubmit: SubmitHandler<IRegisterFormInput> = (body) => {
    setStatus('loading')
    callPost('/auth/register/', { body })
      .then(({ data }) => setUser(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        {t('email')}
        <input {...register('email', { required: true })} />
      </label>
      <label>
        {t('pass')}
        <input type="password" {...register('password', { required: true })} />
      </label>
      <button type="submit">{t('regEnter')}</button>
    </form>
  )
}

export default Register
