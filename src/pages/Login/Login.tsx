import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SIGNUP } from '@src/routes/routeSpecs'
import { User } from '@src/types/User'
import { useUserAuthenticator } from '@src/queries/user'
import { getErrorMessage } from '@src/utils/api'

import { Motion } from '@components/Motion'
import { Alert } from '@components/Alert'
import { getInputClasses } from '@components/atoms/input'
import { getButtonClasses } from '@components/atoms/button'

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

  return (
    <Motion style={{ height: 'inherit', padding: '0 24px' }}>
      <main className="h-full">
        <section className="flex h-full flex-col items-center justify-center text-gray-200">
          <h1 className="text-3xl font-bold">Boardie</h1>
          <p className="my-3 text-center text-base text-gray-200">
            Please fill your details to access your account.
          </p>
          {isError && (
            <Alert severity="error" message={getErrorMessage(error)} />
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-4 flex w-full flex-col items-center gap-4"
          >
            <input
              className={getInputClasses()}
              type="email"
              placeholder="E-mail"
              required
              {...register('email')}
            />
            <input
              className={getInputClasses()}
              type="password"
              placeholder="Pasword"
              required
              {...register('password')}
            />
            <button
              type="submit"
              className={getButtonClasses({
                variant: 'solid',
                size: 'lg',
                color: 'pink',
              })}
            >
              Login
            </button>
            <Link
              to={SIGNUP}
              className="mt-2 text-sm text-gray-200 underline hover:text-pink-300"
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
