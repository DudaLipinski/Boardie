import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../services/user'

import { useDispatch } from 'react-redux'
import { actions as userActions } from '../../state/user'

import * as Styled from '../Login/Login.styles'

import { motion } from 'framer-motion'
import { Button, AutoCenter } from 'antd-mobile'
import { Centralizer } from '../../components/Centralizer'
import { Input } from '../../components/Input'
import { Form } from '../../components/Form'
import { User } from '../../types/User'

export const CreateAccount = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createNewAccount = (createUserPayload: Omit<User, 'id'>) => {
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
      <Centralizer>
        <AutoCenter>
          <Styled.Title>Boardy</Styled.Title>
        </AutoCenter>
        <Styled.Paragraph>
          Please fill your details to create your account.
        </Styled.Paragraph>
        <Form name="normal_login" layout="vertical" onFinish={createNewAccount}>
          <Form.Item
            name={'firstName'}
            label="First name"
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item
            name={'middleAndSurname'}
            label="Last name"
            rules={[
              {
                required: true,
                message: 'Please input your last name',
              },
            ]}
          >
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item
            name={'email'}
            label="Email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input your e-mail',
              },
            ]}
          >
            <Input placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            name={'age'}
            label="Age"
            rules={[
              {
                min: 0,
                max: 99,
                required: true,
                message: 'Please input your age',
              },
            ]}
          >
            <Input type={'number'} placeholder="Age" />
          </Form.Item>
          <Form.Item
            label="Password"
            name={'password'}
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              block
              size="large"
              color="primary"
              type="submit"
              style={{ fontSize: 'var(--adm-font-size-6)' }}
            >
              Create Account
            </Button>
            <AutoCenter
              style={{
                fontSize: 'var(--adm-font-size-6)',
                marginTop: '20px',
              }}
            >
              <Link to="/login">Login</Link>
            </AutoCenter>
          </Form.Item>
        </Form>
      </Centralizer>
    </motion.div>
  )
}
