import { IconButton, Collapse, Alert as MuiAlert, SxProps } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'

export interface AlertDefinition {
  sx?: SxProps
  severity: 'error' | 'info' | 'success' | 'warning'
  message: string
}
interface Props extends AlertDefinition {
  onClose?: () => void
}

export const Alert = ({ severity, message, sx, onClose }: Props) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const wordsCount = message.split(' ').length
    setTimeout(() => setOpen(false), Math.max(wordsCount * 800, 3000))
  }, [message])

  useEffect(() => {
    if (!open) {
      onClose?.()
    }
  }, [open, onClose])

  return (
    <Collapse
      in={open}
      sx={{
        zIndex: 2,
        marginBottom: '14px',
        boxShadow: 'var(--box-shadow)',
        borderRadius: 'var(--border-radius)',
        ...sx,
        '.MuiCollapse-wrapper, .MuiCollapse-wrapperInner, .MuiPaper-root': {
          borderRadius: 'inherit',
        },
      }}
    >
      <MuiAlert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            size="small"
            onClick={() => {
              setOpen(false)
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </MuiAlert>
    </Collapse>
  )
}
