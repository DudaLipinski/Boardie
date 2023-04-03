import { Container } from '@mui/material'
import { useAuth } from '../core/AuthContext'
import { UnauthenticatedRoutes } from './UnauthenticatedRoutes'
import { AuthenticatedWrapper } from './AuthenticatedWrapper'

const AppRoutes = () => {
  const { isLoggedIn } = useAuth()

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
        padding: '0px!important',
      }}
    >
      {Routes}
    </Container>
  )
}

export default AppRoutes
