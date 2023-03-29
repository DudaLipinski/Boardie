import { motion } from 'framer-motion'
import { Box, Typography, TextField, Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import Link from 'next/link'
import { animationProps } from '../styles/animation'
import { useUserAuthenticator } from '@/queries/user'
import { User } from '@/types/User'
import { Alert } from '@/components/Alert'
import { getErrorMessage } from '@/utils/api'
import { SIGNUP } from '@/routes/routeSpecs'

const styledTextFieldProps = {
  fullWidth: true,
  required: true,
  variant: 'filled',
  margin: 'dense',
} as const

const Login = () => {
  const { mutate, isError, error } = useUserAuthenticator()

  const { handleSubmit, control } = useForm({
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
    <motion.div
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
          Please fill your details to access your account.
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
            <Alert severity="error" message={getErrorMessage(error)} />
          )}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                id="email"
                label="E-mail"
                type="email"
                {...field}
                {...styledTextFieldProps}
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
                {...field}
                {...styledTextFieldProps}
              />
            )}
          />
          <Button fullWidth variant="contained" size="large" type="submit">
            Login
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          margin="12px 0"
          gap="12px"
        >
          <Link style={{ margin: '0 auto' }} href={SIGNUP}>
            Register now!
          </Link>
        </Box>
      </Box>
    </motion.div>
  )
}

export default Login
