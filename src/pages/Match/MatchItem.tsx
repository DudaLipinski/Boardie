/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import moment, { Moment } from 'moment'
import { useParams } from 'react-router-dom'
import { getMatch, createMatch } from '../../services/match'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../../state/user'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Typography,
  InputNumber,
} from 'antd'
import { Match } from '../../types/Match'
import { Participants } from './Participants'
import dayjs from 'dayjs'
import { animationProps } from '../../styles/animation'

const { TextArea } = Input
const { Title } = Typography

export const MatchItem = () => {
  const { id } = useSelector(userSelectors.getUser)
  const { matchId } = useParams()
  const [loading, setLoading] = useState(!!matchId)
  const [initialValues, setInitialValues] = useState<{
    boardgameName: string
    date: Moment
    duration: number
    notes: string
  }>()

  const loadMatch = async (matchId: string) => {
    const foundMatch = await getMatch(matchId)
    setLoading(false)
    setInitialValues({
      boardgameName: foundMatch.boardgameName,
      date: moment(foundMatch.date),
      duration: foundMatch.duration,
      notes: foundMatch.notes,
    })
  }

  useEffect(() => {
    if (matchId) {
      loadMatch(matchId)
    }
  }, [])

  if (loading) {
    return null
  }

  const handleMatch = (matchData: Match) => {
    const date = dayjs(matchData.date).format('ddd, MMMM D, YYYY')
    const match = { ...matchData, authorId: String(id), date: date }

    createMatch(match)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => alert(error.message))
  }

  return (
    <motion.div {...animationProps}>
      <Row
        style={{
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '30px 30px',
        }}
      >
        <Col xs={24} md={24} lg={14} xl={7}>
          <Title level={2}>Match</Title>
          <Form
            layout="vertical"
            name="create-match"
            onFinish={handleMatch}
            autoComplete="off"
            initialValues={initialValues}
          >
            <Form.Item
              name="boardgameName"
              label="Boardgame"
              rules={[
                {
                  required: true,
                  message: `Please input boardgame's name!`,
                },
              ]}
            >
              <Input placeholder="Boardgame' name" />
            </Form.Item>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Item
                name="date"
                label="Date"
                rules={[
                  {
                    required: true,
                    message: `Please input date!`,
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item name="duration" label="Duration">
                <InputNumber placeholder="Duration" />
              </Form.Item>
            </div>
            <label htmlFor="notes">Notes</label>
            <TextArea
              rows={3}
              name="notes"
              placeholder="Notes"
              allowClear={true}
              style={{ marginBottom: 20 }}
            />
            <Form.List
              initialValue={[{ fullName: '', score: null }]}
              name="participants"
            >
              {(fields, { add, remove }) => (
                <Participants fields={fields} add={add} remove={remove} />
              )}
            </Form.List>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: 'right' }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </motion.div>
  )
}
