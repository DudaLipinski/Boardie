import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { TextField, Box, Typography, Button } from '@mui/material'
import { createUser } from '../../services/user'

import { animationProps } from '../../styles/animation'
import { LOGIN } from '../../routes/routeSpecs'

const textFieldProps = {
  fullWidth: true,
  required: true,
  margin: 'dense',
} as const

const validationSchema = yup.object({
  email: yup.string().email('Invalid email address'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length'),
})

export const CreateAccount = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      firstName: '',
      middleAndSurname: '',
      email: '',
      age: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createUser(values).then((createdUser) => {
        if (!createdUser) {
          return
        }

        navigate(LOGIN)
      })
    },
  })

  const getFormikProps = (field: keyof typeof formik.touched) => {
    const error = formik.touched[field] && Boolean(formik.errors[field])
    const helperText = formik.touched[field] && formik.errors[field]

    return {
      error: error,
      helperText: helperText,
    }
  }

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
          Please fill your details to create your account.
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
            id="firstName"
            label="First name"
            type="text"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            {...textFieldProps}
          />
          <TextField
            id="middleAndSurname"
            label="Last name"
            type="text"
            value={formik.values.middleAndSurname}
            onChange={formik.handleChange}
            {...textFieldProps}
          />
          <TextField
            id="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            {...getFormikProps('email')}
            {...textFieldProps}
          />
          <TextField
            id="age"
            label="Age"
            type="number"
            value={formik.values.age}
            onChange={formik.handleChange}
            InputProps={{ inputProps: { min: '0', max: '99' } }}
            {...textFieldProps}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            {...getFormikProps('password')}
            {...textFieldProps}
          />
          <Button fullWidth variant="contained" size="large" type="submit">
            Create account
          </Button>
        </Box>
        <Box margin="12px 0" textAlign="center">
          <Link to={LOGIN}>Login</Link>
        </Box>
      </Box>
    </motion.div>
  )
}
