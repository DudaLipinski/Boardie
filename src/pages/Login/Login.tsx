import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SIGNUP } from '../../routes/routeSpecs'
import { getErrorMessage } from '../../utils/api'
import { User } from '../../types/User'
import { useUserAuthenticator } from '../../queries/user'
import { Motion } from '../../components/Motion'
import { Alert } from '../../components/Alert'

export const Login = () => {
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
        <section className="flex h-full flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Boardie</h1>
          <p className="my-3 text-center text-base">
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
              id="email"
              className="focus:green-800 w-full rounded-t-lg border-b border-gray-600 bg-gray-900 p-3 text-white
              focus:border-green-800  focus:outline-none  focus:ring-1 focus:invalid:border-pink-400 focus:invalid:ring-pink-400"
              type="email"
              placeholder="E-mail"
              required
              {...register('email')}
            />
            <input
              id="password"
              className="focus:green-800 w-full rounded-t-lg border-b border-gray-600 bg-gray-900 p-3 text-white focus:border-green-800 focus:outline-none focus:ring-1 focus:invalid:border-pink-400 focus:invalid:ring-pink-400"
              type="password"
              placeholder="Pasword"
              required
              {...register('password')}
            />
            <button
              type="submit"
              className="duration-400 w-full rounded-lg bg-pink-400 p-2 text-gray-950 transition-colors hover:bg-pink-300"
            >
              Login
            </button>
            <Link
              to={SIGNUP}
              className="mt-2 text-sm text-white underline hover:text-pink-300"
            >
              Register now!
            </Link>
          </form>
        </section>
      </main>
    </Motion>
  )
}
