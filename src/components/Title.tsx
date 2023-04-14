import { SxProps, Typography } from '@mui/material'

export const Title = ({ title, sx }: { title: string; sx?: SxProps }) => {
  return (
    <Typography
      variant="h2"
      component="h1"
      margin="20px 0"
      fontWeight="600"
      sx={sx}
    >
      {title}
    </Typography>
  )
}
