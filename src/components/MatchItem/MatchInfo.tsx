import { Typography, Box } from '@mui/material'
import dayjs from 'dayjs'

interface Props {
  boardgameName: string
  date: string
  duration: number
}

export const MatchInfo = ({ boardgameName, date, duration }: Props) => {
  const [weekDay, month, day] = dayjs(date).format('ddd, MMM, D').split(',')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'inherit',
        alignItems: 'center',
      }}
    >
      <Box textAlign="center">
        <Typography
          variant="body1"
          fontSize="13px"
          fontWeight="600"
          color="secondary.darker"
        >
          {weekDay}
        </Typography>
        <Typography
          variant="body1"
          fontSize="18px"
          fontWeight="700"
          margin="-5px 0"
          color="primary.darker"
        >
          {day}
        </Typography>
        <Typography
          variant="body1"
          fontSize="13px"
          fontWeight="600"
          color="secondary.darker"
        >
          {month}
        </Typography>
      </Box>
      <Box borderRight="2px solid #eeeeee" height="45px" />
      <Box>
        <Typography
          variant="h3"
          fontWeight="700"
          margin="5px 0 2px 0"
          fontSize="18px"
          color="primary.darker"
        >
          {boardgameName}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight="400"
          margin="0"
          fontSize="14px"
          color="secondary.darker"
        >
          {duration} hour gaming between 4pm~6pm
        </Typography>
      </Box>
    </Box>
  )
}
