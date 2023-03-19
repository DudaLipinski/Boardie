import { Typography, Box } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  boardgameName: string
  date: string | Dayjs
  highestScore: number
}

export const MatchInfo = ({ boardgameName, date, highestScore }: Props) => {
  const [weekDay, month, day] = dayjs(date).format('ddd MMM D').split(' ')

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="start"
      alignItems="center"
      width="initial"
    >
      <Box textAlign="center" paddingRight="8px" minWidth="28px">
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
          margin="-5px 0"
          fontSize="18px"
          fontWeight="700"
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
      <Box borderLeft="2px solid #eeeeee" height="45px" paddingRight="12px" />
      <Box>
        <Typography
          variant="h3"
          margin="5px 0 2px 0"
          fontSize="16px"
          fontWeight="700"
          color="primary.darker"
          display="-webkit-box"
          textOverflow="ellipsis"
          overflow="hidden"
          sx={{
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {boardgameName}
        </Typography>
        <Typography
          variant="subtitle1"
          margin="0"
          fontSize="13px"
          fontWeight="400"
          color="secondary.darker"
        >
          {highestScore > 0
            ? `Highest score: ${highestScore}pts`
            : 'Match without score'}
        </Typography>
      </Box>
    </Box>
  )
}
