import { Layout } from 'antd'
import { motion } from 'framer-motion'
const { Content } = Layout

export const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Layout>
        <Content>Welcome!</Content>
      </Layout>
    </motion.div>
  )
}
