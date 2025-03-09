import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useUserCreation } from '@src/queries/user'
import { User } from '@src/types/User'
import {
  LOGIN,
  SIGNUP_ANON_FRIEND_INVITE_TOKEN_PARAM,
} from '@src/routes/routeSpecs'
import { getErrorMessage } from '@src/utils/api'

import { Alert } from '@components/Alert'
import { Motion } from '@components/Motion'
import { getButtonClasses } from '@components/atoms/button'
import { Input } from '@components/molecules/Input'
import { useVerifyAnonFriendInviteToken } from '@src/queries/friends'

interface FormUser extends Omit<User, 'age' | 'token' | 'id'> {
  age: string
}

const useAnonFriendInviteToken = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const anonFriendInviteToken =
    queryParams.get(SIGNUP_ANON_FRIEND_INVITE_TOKEN_PARAM) ?? undefined

  const verifyAnonFriendInviteToken = useVerifyAnonFriendInviteToken()
  useEffect(() => {
    if (anonFriendInviteToken) {
      verifyAnonFriendInviteToken.mutate(anonFriendInviteToken)
    }
  }, [anonFriendInviteToken])

  return {
    ...verifyAnonFriendInviteToken,
    token: anonFriendInviteToken,
  }
}

const Signup = () => {
  const { mutate, isError, error } = useUserCreation()

  const anonFriendInviteToken = useAnonFriendInviteToken()

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
      anonFriendInviteToken: anonFriendInviteToken.token,
    }

    mutate(user)
    return
  }

  const buttonClassName = getButtonClasses()

  const disable = anonFriendInviteToken.isLoading

  return (
    <Motion style={{ height: 'inherit', padding: '0 24px' }}>
      <main className="h-full">
        <section className="flex h-full flex-col items-center justify-center text-gray-200">
          {anonFriendInviteToken.isError ? (
            <>
              <p className="my-3 text-center text-base text-gray-200">
                {getErrorMessage(anonFriendInviteToken.error)}
              </p>

              <Link
                to={LOGIN}
                className="mx-auto mt-6 text-sm text-gray-200 underline hover:text-pink-300"
              >
                Go to login
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Sign up</h1>

              {anonFriendInviteToken.data ? (
                <div>
                  <p className="my-3 text-center text-base text-gray-200">
                    Is it{' '}
                    <span className="font-bold text-pink-400">
                      {anonFriendInviteToken.data.anonFriendFullName}
                    </span>{' '}
                    that I'm talking with?{' '}
                    <FavoriteIcon className="-mt-[3px]" fontSize="inherit" />
                  </p>

                  <p className="my-3 text-center text-base text-gray-200">
                    You have been invited by{' '}
                    <span className="font-bold">
                      {anonFriendInviteToken.data.invitingUser.firstName}{' '}
                      {anonFriendInviteToken.data.invitingUser.middleAndSurname}
                    </span>{' '}
                    <br />
                    to join <em>Boardie!</em>
                  </p>

                  <p className="my-3 text-center text-sm">
                    <em>
                      By using this invite you will have{' '}
                      <span className="font-bold">
                        {anonFriendInviteToken.data.invitingUser.firstName}{' '}
                        {
                          anonFriendInviteToken.data.invitingUser
                            .middleAndSurname
                        }
                      </span>{' '}
                      as a friend and might have some existing matches waiting
                      for you!
                    </em>
                  </p>
                </div>
              ) : (
                <p className="my-3 text-center text-base text-gray-200">
                  Please fill your details to create your account.
                </p>
              )}

              {isError && (
                <Alert severity="error" message={getErrorMessage(error)} />
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col"
              >
                <Input
                  disabled={disable}
                  label="First Name"
                  required
                  {...register('firstName')}
                  type="text"
                />
                <Input
                  disabled={disable}
                  label="Surname"
                  required
                  {...register('middleAndSurname')}
                  type="text"
                />
                <Input
                  disabled={disable}
                  label="E-mail"
                  required
                  {...register('email')}
                  type="email"
                />
                <Input
                  disabled={disable}
                  label="Age"
                  required
                  {...register('age')}
                  type="number"
                  min="1"
                  max="130"
                />
                <Input
                  disabled={disable}
                  label="Password"
                  required
                  {...register('password')}
                  type="password"
                  min="8"
                />
                <button
                  type="submit"
                  disabled={disable}
                  className={`mt-6 ${buttonClassName}`}
                >
                  Register
                </button>
                <Link
                  to={LOGIN}
                  className="mx-auto mt-6 text-sm text-gray-200 underline hover:text-pink-300"
                >
                  Login
                </Link>
              </form>
            </>
          )}
        </section>
      </main>
    </Motion>
  )
}

export default Signup
