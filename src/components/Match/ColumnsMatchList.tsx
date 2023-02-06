import { Space } from 'antd'
import { Link } from 'react-router-dom'

interface Id {
  id: string
}

export const renderActionColumn = (text: string, { id }: Id) => {
  return (
    <Space size="middle">
      <Link to={`${id}`}>View</Link>
    </Space>
  )
}

export const columns = [
  {
    title: 'Boargame',
    dataIndex: 'boardgameName',
    key: 'boardgameName',
  },
  {
    title: 'Winner',
    dataIndex: 'winner',
    key: 'winner',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: renderActionColumn,
  },
]
