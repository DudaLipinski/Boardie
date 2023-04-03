import { Box, CircularProgress } from '@mui/material'

export const FullScreenLoader = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <CircularProgress />
    </Box>
  )
}
