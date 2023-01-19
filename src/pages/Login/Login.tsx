import { authUser } from '../../services/user'

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { actions as userActions } from '../../state/user'
import { Link } from 'react-router-dom'

import * as Styled from './Login.styles'
import { Input } from '../../components/Input'
import { Form } from '../../components/Form'
import { Centralizer } from '../../components/Centralizer'
import { Button, AutoCenter } from 'antd-mobile'
import { motion } from 'framer-motion'
import { User } from '../../types/User'

export const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFinishFailed = (errorInfo: string) => {
    alert(`Failed: ${errorInfo}`)
  }

  const handleLogin = (loginPayload: Pick<User, 'email' | 'password'>) => {
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
      <Centralizer>
        <AutoCenter>
          <Styled.Title>Boardy</Styled.Title>
        </AutoCenter>
        <Styled.Paragraph>
          Please fill your details to access your account.
        </Styled.Paragraph>
        <Form
          name="normal_login"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinishFailed={onFinishFailed}
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: 'Please input your e-mail!',
              },
            ]}
          >
            <Input placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Styled.Checkbox>Remember me</Styled.Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              block
              size="large"
              color="primary"
              type="submit"
              style={{ fontSize: 'var(--adm-font-size-6)' }}
            >
              Login
            </Button>
            <Styled.WrapperLinks>
              <Link to="/create-account">Register now!</Link>
              <Link to="">Forgot password</Link>
            </Styled.WrapperLinks>
          </Form.Item>
        </Form>
      </Centralizer>
    </motion.div>
  )
}
