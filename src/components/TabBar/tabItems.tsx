import { MessageOutline, SmileOutline, UserOutline } from 'antd-mobile-icons'
import { PROFILE, MATCHES, FRIENDS } from '../../routes/routeSpecs'

export const tabItems = [
  {
    key: MATCHES,
    title: 'Matches',
    icon: <SmileOutline />,
  },
  {
    key: FRIENDS,
    title: 'Friends',
    icon: <MessageOutline />,
  },
  {
    key: PROFILE,
    title: 'Me',
    icon: <UserOutline />,
  },
]
