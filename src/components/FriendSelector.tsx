import {
  createFilterOptions,
  Autocomplete,
  TextField,
  FilterOptionsState,
  Chip,
} from '@mui/material'

import React, { useEffect, useMemo } from 'react'
import { Verified } from '@mui/icons-material'
import { t } from '@lingui/macro'
import { useAnonFriendCreation, useFriends } from '../queries/friends'
import { GenericUser } from '../types/GenericUser'
import { userToGeneric } from '../utils/friends'
import { useUser } from '../queries/user'

interface ExistentOrNewFriend extends GenericUser {
  newFriendName?: string
}

interface Props {
  index: number
  value: GenericUser
  includeLoggedUser?: boolean
  onChange: (friend: GenericUser | null) => void
}

const filter = createFilterOptions<ExistentOrNewFriend>()

export const FriendSelector = ({
  index,
  value,
  includeLoggedUser = true,
  onChange,
}: Props) => {
  const friendsQuery = useFriends()
  const { data: loggedUser } = useUser()
  const {
    mutate,
    data: newFriend,
    isLoading,
    isSuccess,
  } = useAnonFriendCreation()

  const isLoggedUser = (user: GenericUser) =>
    user.type === 'USER' && loggedUser?.id === user.id

  const handleChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: string | ExistentOrNewFriend | null
  ) => {
    const newFriendFullName =
      typeof newValue === 'string' ? newValue : newValue?.newFriendName

    if (newFriendFullName) {
      mutate(newFriendFullName)
      return
    }

    if (typeof newValue === 'string') {
      return
    }

    onChange(newValue)
  }

  useEffect(() => {
    if (isSuccess) {
      newFriend && onChange(newFriend)
    }
  }, [isSuccess, newFriend, onChange])

  const filterOptions = (
    options: ExistentOrNewFriend[],
    params: FilterOptionsState<ExistentOrNewFriend>
  ) => {
    const filtered = filter(options, params)
    const { inputValue } = params

    const alreadyExists = options.some(
      (option: { fullName: string }) =>
        option.fullName.toLowerCase() === inputValue.toLowerCase()
    )

    if (inputValue !== '' && !alreadyExists) {
      filtered.push({
        id: 0,
        newFriendName: inputValue,
        fullName: `Add "${inputValue}"`,
        type: 'ANON_FRIEND',
      })
    }

    return filtered
  }

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option
    }

    if (option.inputValue) {
      return option.inputValue
    }

    return option.fullName
  }

  const options = useMemo(() => {
    const friends = [...(friendsQuery.data || [])]
    const orderedFriends = friends.sort((a) => (a.type === 'USER' ? -1 : 1))

    if (includeLoggedUser && loggedUser) {
      orderedFriends.push(userToGeneric(loggedUser))
    }

    return orderedFriends
  }, [friendsQuery.data, loggedUser, includeLoggedUser])

  return (
    <>
      <Autocomplete
        value={value}
        onChange={handleChange}
        filterOptions={filterOptions}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id={`players[${index}].friend.fullName`}
        options={options}
        getOptionLabel={getOptionLabel}
        renderOption={(props, user) => (
          <li {...props}>
            {user.fullName}

            {isLoggedUser(user) ? (
              <Chip
                label="You"
                size="small"
                sx={{ marginLeft: 'auto' }}
                color="default"
              />
            ) : user.type === 'USER' ? (
              <div title={t`Registered user`} style={{ marginLeft: 'auto' }}>
                <Verified color="disabled" />
              </div>
            ) : null}
          </li>
        )}
        freeSolo
        autoHighlight={true}
        loading={friendsQuery.isLoading || isLoading}
        renderInput={(params) => (
          <TextField
            required
            {...params}
            size="small"
            label="Add player"
            placeholder="Select a friend or create one"
          />
        )}
      />
    </>
  )
}
