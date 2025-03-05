import { Button, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const Header = ({
  title,
  children,
  onBack,
}: {
  title: string
  children?: React.ReactElement
  onBack?: () => void
}) => (
  <div className="flex justify-between items-center flex-row py-6">
    <div className="flex gap-4 items-center">
      {onBack && (
        <Button
          aria-label="Close"
          onClick={onBack}
          variant="outlined"
          sx={{ minWidth: '20px', padding: '8px 8px' }}
        >
          <ArrowBackIosNewIcon />
        </Button>
      )}
      <Typography variant="h2" component="h1" fontWeight="600">
        {title}
      </Typography>
    </div>
    {children}
  </div>
)

export default Header
