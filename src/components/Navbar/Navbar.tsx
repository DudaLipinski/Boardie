import { NavBar as Nav } from 'antd-mobile'
import styled from 'styled-components'

const Top = styled.nav`
  flex: 0;
  border-bottom: solid 1px var(--adm-color-border);
`

export const Navbar = () => {
  return (
    <Top>
      <Nav style={{ padding: '4px 0 2px' }}></Nav>
    </Top>
  )
}
