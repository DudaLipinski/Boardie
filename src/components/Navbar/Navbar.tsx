import { NavBar as Nav } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Top = styled.nav`
  flex: 0;
  border-bottom: solid 1px var(--adm-color-border);
`

export const Navbar = () => {
  const navigate = useNavigate()

  return (
    <Top>
      <Nav onBack={() => navigate(-1)} style={{ padding: '4px 0 2px' }}></Nav>
    </Top>
  )
}
