import {
  Modal,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { useEffect, useRef } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Alert } from '@components/Alert'
import { getErrorMessage } from '@src/utils/api'
import { useFriendshipRequestCreation } from '@src/queries/friends'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 344,
  bgcolor: 'background.paper',
  borderRadius: 'var(--border-radius)',
  padding: '16px',
}

interface Props {
  setOpen: (open: boolean) => void
  open: boolean
}

interface FormValues {
  email: string
}

export const SendFriendRequestModal = ({ setOpen, open }: Props) => {
  const emailInput = useRef<HTMLDivElement | null>(null)

  const {
    mutate,
    isSuccess,
    isError,
    error,
    reset: resetMutation,
  } = useFriendshipRequestCreation()

  const {
    handleSubmit,
    control,
    reset: resetForm,
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => setOpen(false), 1000)
    }
  }, [isSuccess, setOpen])

  useEffect(() => {
    if (isError) {
      emailInput.current?.querySelector('input')?.focus()
    }
  }, [isError])

  const onSubmit = (value: FormValues) => {
    mutate(value.email)
    return
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
        resetForm()
        resetMutation()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ ...style }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="12px"
        >
          <Typography
            variant="h5"
            component="h3"
            fontWeight="700"
            color="primary.darker"
          >
            Add a new friend
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={() => setOpen(false)}
            sx={{ minWidth: '20px', padding: '6px' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {isError && <Alert severity="error" message={getErrorMessage(error)} />}
        {isSuccess && <Alert severity="success" message="Request sent!" />}
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                required
                fullWidth
                type="email"
                variant="outlined"
                margin="dense"
                label="Friend's e-mail"
                sx={{
                  margin: 0,
                }}
                {...field}
                ref={emailInput}
              />
            )}
          />
          <Button
            aria-label="delete"
            variant="contained"
            type="submit"
            sx={{ minWidth: '40px' }}
          >
            <PersonAddAlt1Icon />
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
