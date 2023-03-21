import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'

import { motion } from 'framer-motion'
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { useQueryClient } from 'react-query'
import { animationProps } from '../../styles/animation'
import { CREATE_ACCOUNT, MATCHES } from '../../routes/routeSpecs'
import { authenticateUser } from '../../services/user'
import { useAuth } from '../../core/AuthContext'
import { setToken } from '../../utils/api'

export const Login = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuth()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      authenticateUser(values)
        .then((response) => {
          if (!response) {
            throw new Error('Internal error')
          }

          queryClient.setQueryData('user', response.user)
          navigate(MATCHES)
          setToken(response.token)
          setIsLoggedIn(true)
        })
        .catch((error: any) => alert(error.message))
    },
  })

  return (
    <motion.div {...animationProps} style={{ height: 'inherit' }}>
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
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap="12px"
        >
          <TextField
            fullWidth
            required
            variant="filled"
            id="email"
            label="E-mail"
            margin="dense"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            required
            variant="filled"
            id="password"
            label="Password"
            margin="dense"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
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
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          margin="12px 0"
          gap="12px"
        >
          <Link to="#">Forgot password</Link>
          <Link to={CREATE_ACCOUNT}>Register now!</Link>
        </Box>
      </Box>
    </motion.div>
  )
}
