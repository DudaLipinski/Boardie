import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../state/user'

import { UnauthenticatedRoutes } from './UnauthenticatedRoutes'
import { AuthenticatedWrapper } from './AuthenticatedWrapper'
import { Container } from '@mui/material'

const AppRoutes = () => {
  const isLoggedIn = useSelector(userSelectors.getIsLoggedIn)

  const Routes = isLoggedIn ? (
    <AuthenticatedWrapper />
  ) : (
    <UnauthenticatedRoutes />
  )

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: 'calc(100vh - 40px)',
        backgroundColor: 'var(--adm-color-background)',
        margin: '20px auto',
        display: 'block',
        boxShadow: '0px 5px 20px 5px rgba(36, 35, 33, 0.17)',
        borderRadius: '20px',
      }}
    >
      {Routes}
    </Container>
  )
}

export default AppRoutes
