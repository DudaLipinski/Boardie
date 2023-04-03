import { Layout } from 'antd'
import { Motion } from '../../components/Motion'
const { Content } = Layout

export const Dashboard = () => {
  return (
    <Motion>
      <Layout>
        <Content>Welcome!</Content>
      </Layout>
    </Motion>
  )
}
