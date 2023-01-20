import React, { useState, createElement } from 'react'
import { items } from './MenuItems'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { actions as userActions } from '../../state/user'

import * as Styled from './MenuLayoutWrapper.styles'
import character from '../../assets/character_2.png'

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Layout, Menu as SidebarMenu, Switch, Breadcrumb } from 'antd'
import { motion } from 'framer-motion'
const { Header, Sider, Content } = Layout

export const MenuLayoutWrapper = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const pathname = window.location.pathname
  const activeMenuItem = pathname.split('').splice(1).join('')
  const breadcrumbTitle =
    activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)

  const [collapsed, setCollapsed] = useState(false)

  const [theme, setTheme] = useState('light')
  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light')
  }

  const onClick = (e) => {
    navigate(`/${e.key}`)
  }

  const doLogout = () => {
    dispatch(userActions.setUser(null))
    localStorage.clear()
    navigate('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Layout
        style={{
          height: '100vh',
        }}
      >
        <Sider
          trigger={true}
          collapsible
          collapsed={collapsed}
          theme={theme}
          style={{ padding: '30px 0' }}
        >
          <Styled.Character src={character} alt="" />
          <SidebarMenu
            theme={theme}
            onClick={onClick}
            selectedKeys={activeMenuItem}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ padding: 0, background: 'white' }}
          >
            <Styled.HeaderWrapper>
              <div style={{ display: 'flex' }}>
                {createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed),
                  }
                )}
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link to="/dashboard">Dashboard</Link>
                  </Breadcrumb.Item>
                  {activeMenuItem === 'dashboard' ? null : activeMenuItem ===
                    'match' ? (
                    <>
                      <Breadcrumb.Item>
                        <Link to="/matches">Matches</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <Link to={pathname}>{breadcrumbTitle}</Link>
                      </Breadcrumb.Item>
                    </>
                  ) : (
                    <Breadcrumb.Item>
                      <Link to={pathname}>{breadcrumbTitle}</Link>
                    </Breadcrumb.Item>
                  )}
                </Breadcrumb>
              </div>
              <div>
                <Switch
                  checked={theme === 'dark'}
                  onChange={changeTheme}
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
                />
                <Styled.Logout onClick={doLogout} shape="round" size="small">
                  Logout
                </Styled.Logout>
              </div>
            </Styled.HeaderWrapper>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </motion.div>
  )
}
