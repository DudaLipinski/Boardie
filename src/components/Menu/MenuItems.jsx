import { HomeOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}
export const items = [
  getItem('Dashboard', 'dashboard', <HomeOutlined />),
  getItem('Matches', 'matches', <TrophyOutlined />),
  getItem('Profile', 'profile', <UserOutlined />),
]
