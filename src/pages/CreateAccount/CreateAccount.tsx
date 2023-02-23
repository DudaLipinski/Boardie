import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../services/user'

import { useDispatch } from 'react-redux'
import { actions as userActions } from '../../state/user'

import { motion } from 'framer-motion'
import { User } from '../../types/User'
import { Container, TextField, Box, Typography, Button } from '@mui/material'

export const CreateAccount = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createNewAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const createUserPayload: Omit<User, 'id' | 'token'> = {
      firstName: data.get('firstName') as string,
      middleAndSurname: data.get('middleAndSurname') as string,
      email: data.get('email') as string,
      age: data.get('age') as string,
      password: data.get('password') as string,
    }

    createUser(createUserPayload).then((createdUser) => {
      if (!createdUser) {
        return
      }
      dispatch(userActions.setUser(createdUser))
    })

    navigate('/dashboard')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: 'inherit' }}
    >
      <Container
        sx={{
          height: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '80%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            align="center"
            sx={{ fontWeight: '600' }}
          >
            Boardie
          </Typography>
          <Typography gutterBottom align="center">
            Please fill your details to create your account.
          </Typography>
          <Box
            component="form"
            onSubmit={createNewAccount}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <TextField
              fullWidth
              required
              variant="filled"
              id="firstName"
              name="firstName"
              label="First name"
              margin="dense"
              type="text"
            />
            <TextField
              fullWidth
              required
              variant="filled"
              id="middleAndSurname"
              name="middleAndSurname"
              label="Last name"
              margin="dense"
              type="text"
            />
            <TextField
              fullWidth
              required
              variant="filled"
              id="email"
              name="email"
              label="E-mail"
              margin="dense"
              type="email"
            />
            <TextField
              fullWidth
              required
              variant="filled"
              id="age"
              name="age"
              label="Age"
              margin="dense"
              type="number"
              InputProps={{ inputProps: { min: '0', max: '99' } }}
            />
            <TextField
              fullWidth
              required
              variant="filled"
              id="password"
              name="password"
              label="Password"
              margin="dense"
              type="password"
            />
            <Button fullWidth variant="contained" size="large" type="submit">
              Create account
            </Button>
          </Box>
          <Box
            sx={{
              margin: '12px 0',
            }}
          >
            <Link to="/login">Login</Link>
          </Box>
        </Box>
      </Container>
    </motion.div>
  )
}
