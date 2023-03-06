import { Layout } from 'antd'
import { motion } from 'framer-motion'
import { animationProps } from '../../styles/animation'
const { Content } = Layout

export const Dashboard = () => {
  return (
    <motion.div {...animationProps}>
      <Layout>
        <Content>Welcome!</Content>
      </Layout>
    </motion.div>
  )
}
