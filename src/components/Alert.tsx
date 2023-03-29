import { IconButton, Collapse, Alert as MuiAlert, SxProps } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'

export interface AlertDefinition {
  sx?: SxProps
  severity: 'error' | 'info' | 'success' | 'warning'
  message: string
  'data-testid'?: string
}
interface Props extends AlertDefinition {
  onClose?: () => void
}

export const Alert = ({ severity, message, sx, onClose, ...props }: Props) => {
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
    <Collapse
      {...props}
      in={open}
      sx={{
        zIndex: 2,
        marginBottom: '14px',
        boxShadow: '2px 2px 13px 0px rgb(0 0 0 / 4%)',
        borderRadius: '4px',
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
            color="inherit"
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
