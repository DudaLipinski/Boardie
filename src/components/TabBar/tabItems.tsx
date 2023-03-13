import {
  AppOutline,
  MessageOutline,
  SmileOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { DASHBOARD, PROFILE, MATCHES, FRIENDS } from '../../routes/routeSpecs'

export const tabItems = [
  {
    key: DASHBOARD,
    title: 'Dashboard',
    icon: <AppOutline />,
  },
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
