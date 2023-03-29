import { Link } from 'react-router-dom'

import { motion } from 'framer-motion'
import { TextField, Box, Typography, Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import { animationProps } from '../../styles/animation'
import { LOGIN } from '../../routes/routeSpecs'
import { useUserCreation } from '../../queries/user'
import { User } from '../../types/User'
import { Alert } from '../../components/Alert'
import { getErrorMessage } from '../../utils/api'

interface FormUser extends Omit<User, 'age' | 'token' | 'id'> {
  age: string
}

const styledTextFieldProps = {
  fullWidth: true,
  required: true,
  margin: 'dense',
  variant: 'filled',
} as const

export const Signup = () => {
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
    <motion.main
      {...animationProps}
      style={{ height: 'inherit', padding: '0 24px' }}
    >
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
        <Typography gutterBottom align="center">
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
              data-testid="signup-error"
              severity="error"
              message={getErrorMessage(error)}
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
    </motion.main>
  )
}
