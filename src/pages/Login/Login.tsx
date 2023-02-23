import { authUser } from '../../services/user'
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { actions as userActions } from '../../state/user'

import { motion } from 'framer-motion'
import { User } from '../../types/User'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material'

export const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const loginPayload: Pick<User, 'email' | 'password'> = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    }

    authUser(loginPayload)
      .then((response) => {
        if (!response) {
          throw new Error('Internal error')
        }
        dispatch(userActions.setUser(response.user))
        navigate('/dashboard')
      })
      .catch((error: any) => alert(error.message))
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
            Please fill your details to access your account.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
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
              id="email"
              name="email"
              label="E-mail"
              margin="none"
              type="email"
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
            <FormControlLabel
              value="end"
              control={<Checkbox />}
              label="Remember me"
              labelPlacement="end"
            />
            <Button fullWidth variant="contained" size="large" type="submit">
              Login
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              margin: '12px 0',
            }}
          >
            <Link to="#">Forgot password</Link>
            <Link to="/create-account">Register now!</Link>
          </Box>
        </Box>
      </Container>
    </motion.div>
  )
}
