import { TabBar as Tab } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { tabsItems } from './TabItems'

const Bottom = styled.div`
  flex: 0;
  border-top: solid 1px var(--adm-color-border);
`

export const TabBar = () => {
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()

  const setRouteActive = (value: string) => {
    navigate(value)
  }

  return (
    <Bottom>
      <Tab activeKey={pathname} onChange={(value) => setRouteActive(value)}>
        {tabsItems.map((item) => (
          <Tab.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </Tab>
    </Bottom>
  )
}
