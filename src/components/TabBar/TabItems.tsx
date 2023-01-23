import {
  AppOutline,
  MessageOutline,
  SmileOutline,
  UserOutline,
} from 'antd-mobile-icons'

export const tabsItems = [
  {
    key: '/dashboard',
    title: 'Dashboard',
    icon: <AppOutline />,
  },
  {
    key: '/matches',
    title: 'Matches',
    icon: <SmileOutline />,
  },
  {
    key: '/friends',
    title: 'Friends',
    icon: <MessageOutline />,
  },
  {
    key: '/profile',
    title: 'Me',
    icon: <UserOutline />,
  },
]
