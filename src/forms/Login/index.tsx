'use client'

import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useFetch } from '@/hook/useFetch'
import { useAuthContext } from '@/providers/auth'


interface ILoginFormInput {
  email: string
  password: string
}

const Login = () => {
  const t = useTranslations('Auth')
  const { register, handleSubmit } = useForm<ILoginFormInput>()
  const { callPost } = useFetch()
  const { setStatus, setUser } = useAuthContext()
  const onSubmit: SubmitHandler<ILoginFormInput> = (body) => {
    setStatus('loading')
    callPost('/auth/login/', { body })
      .then(({ data }) => setUser(data))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          {t('email')}
          <input {...register('email', { required: true })} />
        </label>
        <label>
          {t('pass')}
          <input type="password" {...register('password', { required: true })} />
        </label>
        <button type="submit">{t('enter')}</button>
      </form>
    </>
  )
}

export default Login
