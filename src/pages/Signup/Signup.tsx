import { useForm } from 'react-hook-form'
import { useUserCreation } from '@src/queries/user'
import { User } from '@src/types/User'
import { LOGIN } from '@src/routes/routeSpecs'
import { getErrorMessage } from '@src/utils/api'

import { Link } from 'react-router-dom'
import { Alert } from '@components/Alert'
import { Motion } from '@components/Motion'
import { getButtonClasses } from '@components/atoms/button'
import { Input } from '@components/molecules/Input'

interface FormUser extends Omit<User, 'age' | 'token' | 'id'> {
  age: string
}

const Signup = () => {
  const { mutate, isError, error } = useUserCreation()

  const { handleSubmit, register } = useForm({
    defaultValues: {
      firstName: '',
      middleAndSurname: '',
      email: '',
      age: '',
      password: '',
    },
  })

  const onSubmit = (value: FormUser) => {
    const age = parseInt(value.age)
    const user = {
      ...value,
      age,
    }

    mutate(user)
    return
  }

  return (
    <Motion style={{ height: 'inherit', padding: '0 24px' }}>
      <main className="h-full">
        <section className="flex h-full flex-col items-center justify-center text-gray-200">
          <h1 className="text-3xl font-bold">Boardie</h1>
          <p className="my-3 text-center text-base text-gray-200">
            Please fill your details to create your account.
          </p>
          {isError && (
            <Alert severity="error" message={getErrorMessage(error)} />
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-4 flex w-full flex-col gap-5"
          >
            <Input
              label="First Name"
              required
              {...register('firstName')}
              type="text"
            />
            <Input
              label="Surname"
              required
              {...register('middleAndSurname')}
              type="text"
            />
            <Input
              label="E-mail"
              required
              {...register('email')}
              type="email"
            />
            <Input
              label="Age"
              required
              {...register('age')}
              type="number"
              min="1"
              max="130"
            />
            <Input
              label="Password"
              required
              {...register('password')}
              type="password"
              min="8"
            />
            <button type="submit" className={getButtonClasses()}>
              Register
            </button>
            <Link
              to={LOGIN}
              className="mx-auto mt-2 text-sm text-gray-200 underline hover:text-pink-300"
            >
              Login
            </Link>
          </form>
        </section>
      </main>
    </Motion>
  )
}

export default Signup
