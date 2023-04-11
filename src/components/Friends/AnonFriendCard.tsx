import { Box, IconButton, ListItem, Stack, TextField } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { Avatar } from '../Avatar'
import { GenericUser } from '../../types/GenericUser'
import { useDeleteAnonFriend, useUpdateAnonFriend } from '../../queries/friends'
import { DeleteDialog } from '../DeleteDialog'

const styledListItem = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: 'inherit',
  margin: '0 auto 16px',
  bgcolor: 'background.paper',
  boxShadow: '2px 2px 13px 0px rgb(0 0 0 / 4%)',
  borderRadius: '4px',
  justifyContent: 'space-between',
}

const styledDisabledInput = {
  '& .MuiOutlinedInput-notchedOutline': {
    border: '0px',
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: 'var(--adm-color-neutral-800)',
  },
}

interface FormValues {
  fullName: string
}

export const AnonFriendCard = ({ friend }: { friend: GenericUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { mutate: mutateUpdateFriend, isSuccess: isSuccessUpdateFriend } =
    useUpdateAnonFriend()
  const { mutate: mutateDeleteFriend, isLoading: isLoadingDeleteFriend } =
    useDeleteAnonFriend()

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      fullName: friend.fullName,
    },
  })

  const updateAnonFriend = (value: FormValues) => {
    mutateUpdateFriend({ ...value, anonFriendId: friend.id })
    return
  }

  useEffect(() => {
    if (isSuccessUpdateFriend) {
      setIsEditing(false)
    }
  }, [isSuccessUpdateFriend])

  const handleDelete = () => {
    mutateDeleteFriend(friend.id)
  }

  return (
    <>
      <ListItem sx={{ ...styledListItem }}>
        <Box
          display="flex"
          alignItems="center"
          component="form"
          sx={!isEditing ? { ...styledDisabledInput } : null}
        >
          <Avatar user={friend} size={'sm'} />
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                required
                disabled={!isEditing}
                type="text"
                size="small"
                sx={{ margin: '0 10px 0 10px' }}
                {...field}
              />
            )}
          />
          <Stack direction="row" spacing={0}>
            {isEditing ? (
              <IconButton
                aria-label="edit"
                size="small"
                onClick={handleSubmit(updateAnonFriend)}
              >
                <CheckOutlinedIcon fontSize="inherit" color="success" />
              </IconButton>
            ) : (
              <IconButton
                aria-label="edit"
                size="small"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                <ModeEditOutlinedIcon fontSize="inherit" />
              </IconButton>
            )}
            <IconButton aria-label="invite" size="small">
              <EmailOutlinedIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <DeleteOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box>
        <DeleteDialog
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          handleDelete={handleDelete}
          isLoading={isLoadingDeleteFriend}
          title={'Delete this friend?'}
        />
      </ListItem>
    </>
  )
}
