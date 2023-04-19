import { Controller, useForm } from 'react-hook-form'
import { useUserCreation } from '@src/queries/user'
import { User } from '@src/types/User'
import { LOGIN } from '@src/routes/routeSpecs'
import { getErrorMessage } from '@src/utils/api'

import { Link } from 'react-router-dom'
import { TextField, Box, Typography, Button } from '@mui/material'
import { Alert } from '@components/Alert'
import { Motion } from '@components/Motion'

interface FormUser extends Omit<User, 'age' | 'token' | 'id'> {
  age: string
}

const styledTextFieldProps = {
  fullWidth: true,
  required: true,
  margin: 'dense',
  variant: 'filled',
} as const

const Signup = () => {
  const { mutate, isError, error } = useUserCreation()

  const { handleSubmit, control } = useForm({
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
      <Box
        height="inherit"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="12px"
      >
        <Typography variant="h1" component="h1" align="center" fontWeight="600">
          Boardie
        </Typography>
        <Typography gutterBottom align="center" component="p">
          Please fill your details to create your account.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap="12px"
        >
          {isError && (
            <Alert
              severity="error"
              message={getErrorMessage(error)}
              testid="signup-error"
            />
          )}
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                id="firstName"
                label="First name"
                type="text"
                {...styledTextFieldProps}
                {...field}
              />
            )}
          />
          <Controller
            name="middleAndSurname"
            control={control}
            render={({ field }) => (
              <TextField
                id="middleAndSurname"
                label="Last name"
                type="text"
                {...styledTextFieldProps}
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                id="email"
                label="Email"
                type="email"
                {...styledTextFieldProps}
                {...field}
              />
            )}
          />
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <TextField
                id="age"
                label="Age"
                type="number"
                InputProps={{ inputProps: { min: '1', max: '120' } }}
                {...styledTextFieldProps}
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                id="password"
                label="Password"
                type="password"
                {...styledTextFieldProps}
                {...field}
              />
            )}
          />
          <Button fullWidth variant="contained" size="large" type="submit">
            Create account
          </Button>
        </Box>
        <Box margin="12px 0" textAlign="center">
          <Link to={LOGIN}>
            <Typography> Login</Typography>
          </Link>
        </Box>
      </Box>
    </Motion>
  )
}

export default Signup
