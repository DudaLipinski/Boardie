import { Container } from '@mui/material'
import { ReactNode } from 'react'

export const Mobile = ({ children }: { children: ReactNode }) => (
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
    {children}
  </Container>
)
