import { MinusCircleOutlined } from '@ant-design/icons'
import { FormListFieldData, InputNumber } from 'antd'
import { Space, Form, Input, Button } from 'antd-mobile'

interface ParticipantsProps {
  fields: FormListFieldData[]
  add: () => void
  remove: (index: number) => void
}

export const Participants = ({ fields, add, remove }: ParticipantsProps) => {
  return (
    <>
      {fields.map(({ key, name, ...restField }, index) => {
        return (
          <>
            <Space
              key={key}
              style={{
                display: 'flex',
                marginBottom: 25,
                alignItems: 'center',
              }}
              className="hello"
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, 'fullName']}
                label="Player's name"
                rules={[
                  {
                    required: true,
                    message: 'Missing score',
                  },
                ]}
              >
                <Input placeholder="Player's name" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'score']}
                label="Score"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: 'Missing score',
                  },
                ]}
              >
                <InputNumber placeholder="Score" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(index)} />
            </Space>
          </>
        )
      })}
      <Form.Item>
        <Button type="button" onClick={add} block>
          Add player
        </Button>
      </Form.Item>
    </>
  )
}
