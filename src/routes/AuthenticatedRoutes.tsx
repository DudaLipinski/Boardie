import { NavBar } from 'antd-mobile'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route } from 'react-router-dom'
import { TabBar } from '../components/TabBar/TabBar'
import styled from 'styled-components'
import { MatchList } from '../pages/Match/MatchList'
import { MatchItem } from '../pages/Match/MatchItem'
import { Profile } from '../pages/Profile/Profile'
import { Dashboard } from '../pages/Dashboard/Dashboard'

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

export const AuthenticatedRoutes = () => {
  return (
    <AnimatePresence>
      <MenuWrapper>
        <NavBar />
        <Content>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<MatchList />} />
            <Route path="/match" element={<MatchItem />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
        <TabBar />
      </MenuWrapper>
    </AnimatePresence>
  )
}
