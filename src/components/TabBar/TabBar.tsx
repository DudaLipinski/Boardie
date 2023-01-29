import { TabBar as Tab } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { tabItems } from './tabItems'

const Bottom = styled.nav`
  flex: 0;
  border-top: solid 1px var(--adm-color-border);
`

export const TabBar = () => {
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()

  return (
    <Bottom>
      <Tab activeKey={pathname} onChange={(value) => navigate(value)}>
        {tabItems.map((item) => (
          <Tab.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </Tab>
    </Bottom>
  )
}
