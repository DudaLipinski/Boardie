import { IconButton, Collapse, Alert as MuiAlert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'

interface Props {
  severity: 'error' | 'info' | 'success' | 'warning'
  message: string
}

export const Alert = ({ severity, message }: Props) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setTimeout(() => setOpen(false), 3000)
  }, [])

  return (
    <Collapse in={open}>
      <MuiAlert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false)
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </MuiAlert>
    </Collapse>
  )
}
