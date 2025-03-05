import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SIGNUP } from 'routes/routeSpecs'
import { User } from '@src/types/User'
import { useUserAuthenticator } from '@src/queries/user'
import { getErrorMessage } from '@src/utils/api'

import { Motion } from '@components/Motion'
import { Alert } from '@components/Alert'
import { getButtonClasses } from '@components/atoms/button'
import { Input } from '@components/molecules/Input'
import { Trans } from '@lingui/macro'

const Login = () => {
  const { mutate, isError, error } = useUserAuthenticator()

  const { handleSubmit, register } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (value: Pick<User, 'email' | 'password'>) => {
    mutate(value)
    return
  }

  const buttonClassName = getButtonClasses()

  return (
    <Motion style={{ height: 'inherit', padding: '0 24px' }}>
      <main className="h-full">
        <section className="flex h-full flex-col items-center justify-center text-gray-200">
          <h1 className="text-3xl font-bold">Boardie</h1>
          <p className="my-3 text-center text-base text-gray-200">
            <Trans>Please fill your details to access your account.</Trans>
          </p>
          {isError && (
            <Alert severity="error" message={getErrorMessage(error)} />
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-4 flex w-full flex-col items-center"
          >
            <Input
              label="E-mail"
              required
              {...register('email')}
              type="email"
            />
            <Input
              label="Password"
              required
              {...register('password')}
              type="password"
              min="8"
            />
            <button type="submit" className={`mt-6 ${buttonClassName}`}>
              Login
            </button>
            <Link
              to={SIGNUP}
              className="mt-6 text-sm text-gray-200 underline hover:text-pink-300"
            >
              Register now!
            </Link>
          </form>
        </section>
      </main>
    </Motion>
  )
}

export default Login
