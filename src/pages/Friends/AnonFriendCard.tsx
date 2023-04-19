import { Box, IconButton, ListItem, Stack, TextField } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useMemo, useRef, useState } from 'react'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { Avatar } from '@components/Avatar'
import { GenericUser } from '@src/types/GenericUser'
import { useDeleteAnonFriend, useUpdateAnonFriend } from '@src/queries/friends'
import { DeleteDialog } from '@components/DeleteDialog'
import { styledCard } from '@src/styles/card'

const styledDisabledInput = {
  '& .MuiOutlinedInput-notchedOutline': {
    border: '0px',
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: 'var(--color-text-body)',
  },
}

interface FormValues {
  fullName: string
}

export const AnonFriendCard = ({ friend }: { friend: GenericUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const nameImput = useRef<HTMLDivElement | null>(null)

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
    const isAnonFriendUpdated =
      JSON.stringify(value.fullName) !== JSON.stringify(friend.fullName)

    if (isAnonFriendUpdated) {
      mutateUpdateFriend({ ...value, anonFriendId: friend.id })
      return
    }

    setIsEditing(false)
    return
  }

  const handleDelete = () => {
    mutateDeleteFriend(friend.id)
  }

  useEffect(() => {
    if (isEditing) {
      nameImput.current?.querySelector('input')?.focus()
    }
  }, [isEditing])

  useEffect(() => {
    if (isSuccessUpdateFriend) {
      setIsEditing(false)
    }
  }, [isSuccessUpdateFriend])

  const fullNameTestId = useMemo(
    () => friend.fullName.split(' ').join('-').toLocaleLowerCase(),
    [friend.fullName]
  )

  return (
    <>
      <ListItem
        sx={{
          ...styledCard,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
                aria-label="Friend name"
                required
                disabled={!isEditing}
                type="text"
                size="small"
                sx={{ margin: '0 10px 0 10px' }}
                {...field}
                ref={nameImput}
              />
            )}
          />
          <Stack
            direction="row"
            spacing={0}
            data-testid={`menu-anonFriend-${fullNameTestId}`}
          >
            {isEditing ? (
              <IconButton
                aria-label="edit"
                onClick={handleSubmit(updateAnonFriend)}
              >
                <CheckOutlinedIcon sx={{ fontSize: '20px' }} color="success" />
              </IconButton>
            ) : (
              <IconButton
                aria-label="edit"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                <ModeEditOutlinedIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            )}
            <IconButton
              aria-label="delete"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <DeleteOutlinedIcon sx={{ fontSize: '20px' }} />
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
