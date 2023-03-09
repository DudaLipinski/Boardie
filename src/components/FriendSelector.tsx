import {
  createFilterOptions,
  Autocomplete,
  TextField,
  FilterOptionsState,
} from '@mui/material'
import React from 'react'
import { useAnonFriendCreation, useFriends } from '../queries/friends'
import { Friend } from '../types/Friend'

interface ExistentOrNewFriend extends Friend {
  newFriendName?: string
}

interface Props {
  index: number
  value: Friend
  onChange: (friend: Friend | null) => void
}

const filter = createFilterOptions<ExistentOrNewFriend>()

export const ParticipantSelector = ({ index, value, onChange }: Props) => {
  const friends = useFriends()
  const createAnonymousFriend = useAnonFriendCreation()

  const handleChange = async (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | ExistentOrNewFriend | null
  ) => {
    const newFriendFullName =
      typeof newValue === 'string' ? newValue : newValue?.newFriendName
    if (newFriendFullName) {
      const newFriend = await createAnonymousFriend.mutateAsync(
        newFriendFullName
      )
      newFriend && onChange(newFriend)
      return
    }

    if (typeof newValue === 'string') {
      return
    }
    onChange(newValue)
  }

  const filterOptions = (
    options: ExistentOrNewFriend[],
    params: FilterOptionsState<ExistentOrNewFriend>
  ) => {
    const filtered = filter(options, params)
    const { inputValue } = params

    const alreadyExists = options.some(
      (option: { fullName: any }) =>
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

  return (
    <>
      <Autocomplete
        value={value}
        onChange={handleChange}
        filterOptions={filterOptions}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id={`participants[${index}].friend.fullName`}
        options={friends.data ?? []}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => <li {...props}>{option.fullName}</li>}
        freeSolo
        autoHighlight={true}
        loading={friends.isLoading || createAnonymousFriend.isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            color="info"
            size="small"
            label="Add participant"
            placeholder="Select a friend or create one"
          />
        )}
      />
    </>
  )
}
