import dayjs from 'dayjs'
import { columns } from '../../components/Match/ColumnsMatchList'
// import { expandedRowRender } from './ExpandedMatch'
import { Table, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useOwnMatches } from '../../hooks/useOwnMatches'
import { Match } from '../../types/Match'
import { motion } from 'framer-motion'
import { matches as matchesMock } from '../../__mocks__/matches'

export const MatchList = () => {
  const navigate = useNavigate()

  const matches = useOwnMatches()

  const matchItems = matches?.map((item: Match) => {
    const winner = item.participants.find((item) => item.isWinner)
    const date = dayjs(item.date).format('ddd, MMMM D, YYYY')

    return {
      id: item.id,
      key: item.id,
      boardgameName: item.boardgameName,
      winner: winner?.fullName,
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
        dataSource={matchesMock}
      />
    </motion.div>
  )
}
