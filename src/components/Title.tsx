import { Typography } from '@mui/material'

export const Title = ({ title }: { title: string }) => {
  return (
    <Typography variant="h2" component="h2" margin="20px 0" fontWeight="600">
      {title}
    </Typography>
  )
}
