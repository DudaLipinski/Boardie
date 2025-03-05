import {
  Box,
  Button,
  IconButton,
  ListItem,
  Stack,
  TextField,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useMemo, useRef, useState } from 'react'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { Avatar } from '@components/Avatar'
import { GenericUser } from '@src/types/GenericUser'
import {
  useCreateAnonFriendInviteToken,
  useDeleteAnonFriend,
  useUpdateAnonFriend,
} from '@src/queries/friends'
import { DeleteDialog } from '@components/DeleteDialog'
import { styledCard } from '@src/styles/card'
import { Trans } from '@lingui/macro'
import { getSignupRouteWithAnonFriendInviteToken } from '@src/routes/routeSpecs'

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

const CopyInviteLinkButton = ({ anonFriendId }: { anonFriendId: number }) => {
  const createAnonFriendInviteToken = useCreateAnonFriendInviteToken()
  const [copied, setCopied] = useState(false)

  const showLoadingTimeout = useRef<number | null>(null)
  const [showLoading, setShowLoading] = useState(false)

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}${getSignupRouteWithAnonFriendInviteToken(
        token
      )}`
    )
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const handleCopyRequest = () => {
    if (createAnonFriendInviteToken.isLoading) {
      return
    }

    if (createAnonFriendInviteToken.data) {
      copyToClipboard(createAnonFriendInviteToken.data)
      return
    }

    createAnonFriendInviteToken.mutate(anonFriendId)
  }

  // We just want to show loading state if the request takes longer than 200ms
  useEffect(() => {
    if (createAnonFriendInviteToken.isLoading) {
      showLoadingTimeout.current = window.setTimeout(() => {
        setShowLoading(true)
      }, 200)
      return
    }

    if (showLoadingTimeout.current) {
      clearTimeout(showLoadingTimeout.current)
    }
    setShowLoading(false)
  }, [createAnonFriendInviteToken.isLoading])

  useEffect(() => {
    if (createAnonFriendInviteToken.data) {
      copyToClipboard(createAnonFriendInviteToken.data)
    }
  }, [createAnonFriendInviteToken.data])

  return (
    <Button onClick={handleCopyRequest} className="w-28">
      {copied ? (
        <div className="flex items-center">
          <div>
            <Trans>Copied</Trans>
          </div>
          <FavoriteIcon className="ml-1" fontSize="inherit" />
        </div>
      ) : createAnonFriendInviteToken.isError ? (
        <span>
          <Trans>Error</Trans>
        </span>
      ) : showLoading ? (
        <span>
          <Trans>Loading</Trans>...
        </span>
      ) : (
        <span className="whitespace-nowrap">
          <Trans>Copy invite link</Trans>
        </span>
      )}
    </Button>
  )
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
            <CopyInviteLinkButton anonFriendId={friend.id} />
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
