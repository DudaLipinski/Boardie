import { NavBar as Nav } from 'antd-mobile'
import styled from 'styled-components'

const Top = styled.div`
  flex: 0;
  border-bottom: solid 1px var(--adm-color-border);
`

export const Navbar = () => {
  return (
    <Top>
      <Nav>NavBar</Nav>
    </Top>
  )
}
