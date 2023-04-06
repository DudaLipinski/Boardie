import { Modal, Typography, TextField, Button, Box } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { useEffect, useRef } from 'react'
import { Alert } from '../Alert'
import { getErrorMessage } from '../../utils/api'
import { useFriendRequestCreation } from '../../queries/friends'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 344,
  bgcolor: 'background.paper',
  boxShadow: 24,
  bordeRadius: '4px',
  padding: '24px 32px',
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
  } = useFriendRequestCreation()

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
        <Typography
          variant="h5"
          component="h3"
          fontWeight="700"
          align="center"
          margin="0 0 20px 0"
          color="primary.darker"
        >
          Add a new friend
        </Typography>
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
