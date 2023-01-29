import { TabBar } from '../components/TabBar/TabBar'
import styled from 'styled-components'
import { Navbar } from '../components/Navbar/Navbar'
import { AuthenticatedRoutes } from './AuthenticatedRoutes'

export const MenuWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AuthenticatedWrapper = () => {
  return (
    <MenuWrapper>
      <Navbar />
      <Content>
        <AuthenticatedRoutes />
      </Content>
      <TabBar />
    </MenuWrapper>
  )
}
