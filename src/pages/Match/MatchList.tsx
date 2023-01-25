import dayjs from 'dayjs'
import { columns } from '../../components/Match/ColumnsMatchList'
// import { expandedRowRender } from './ExpandedMatch'
import { Table, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMatches } from '../../hooks/useMatches'
import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../../state/user'
import { Match } from '../../types/Match'
import { motion } from 'framer-motion'

export const MatchList = () => {
  const navigate = useNavigate()
  const userId = useSelector(userSelectors.getUserId)

  const matches = useMatches(userId)

  const matchItems = matches?.map((item: Match) => {
    const winner = item.participants.find((item) => item.isWinner)
    const date = dayjs(item.date).format('ddd, MMMM D, YYYY')

    return {
      id: item.id,
      key: item.id,
      boardgameName: item.boardgameName,
      winner: winner,
      date: date,
      duration: item.duration,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button
        type="primary"
        onClick={() => navigate('/match')}
        style={{ marginBottom: 30, float: 'right' }}
      >
        Add Match
      </Button>
      <Table
        columns={columns}
        // expandable={{
        //   expandedRowRender,
        // }}
        dataSource={matchItems}
      />
    </motion.div>
  )
}
