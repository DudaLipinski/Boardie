import { IconButton, Collapse, Alert as MuiAlert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'

export interface AlertDefinition {
  severity: 'error' | 'info' | 'success' | 'warning'
  message: string
}
interface Props extends AlertDefinition {
  onClose?: () => void
}

export const Alert = ({ severity, message, onClose }: Props) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const wordsCount = message.split(' ').length
    setTimeout(() => setOpen(false), wordsCount * 700)
  }, [message])

  useEffect(() => {
    if (!open) {
      onClose?.()
    }
  }, [open, onClose])

  return (
    <Collapse in={open} sx={{ position: 'absolute', zIndex: 2 }}>
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
