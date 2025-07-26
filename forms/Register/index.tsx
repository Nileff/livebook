'use client'

import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useFetch } from '@/hook/useFetch'

interface IRegisterFormInput {
  email: string
  password: string
}


const Register = () => {
  const t = useTranslations('Auth')
  const { register, handleSubmit } = useForm<IRegisterFormInput>()
  const { callPost } = useFetch()
  const onSubmit: SubmitHandler<IRegisterFormInput> = (data) => {
    callPost(
      '/auth/register/',
      {
        body: data,
      },
    )
      .then(console.log)
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
      <button type="submit">{t('enter')}</button>
    </form>
  )
}

export default Register
