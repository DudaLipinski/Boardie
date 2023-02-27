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
        height: '100vh',
        backgroundColor: 'var(--adm-color-background)',
        margin: '0 auto',
        display: 'block',
      }}
    >
      {Routes}
    </Container>
  )
}

export default AppRoutes
