import {
  createFilterOptions,
  Autocomplete,
  TextField,
  FilterOptionsState,
} from '@mui/material'
import React from 'react'
import { useFriends } from '../../hooks/useFriends'
import * as friendService from '../../services/friend'
import { Friend } from '../../types/Friend'

interface ParticipantsOption {
  inputValue?: string
  id?: number
  fullName: string
  type?: string
}

interface Props {
  index: number
  value: string
  setFieldValue: (fieldName: string, value: any) => void
}

const filter = createFilterOptions<ParticipantsOption>()

export const ParticipantSelector = ({ index, value, setFieldValue }: Props) => {
  // const [value, setValue] = React.useState<ParticipantsOption | null>(null)

  const friends: ParticipantsOption[] = useFriends()

  const createAnonymousFriend = (friend: Pick<Friend, 'fullName'>) =>
    friendService
      .createAnonymous(friend)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => alert(error.message))

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | ParticipantsOption | null
  ) => {
    const newFriendFullName =
      typeof newValue === 'string' ? newValue : newValue?.inputValue
    if (newFriendFullName) {
      createAnonymousFriend({ fullName: newFriendFullName })

      // setValue({
      //   fullName: newFriendFullName,
      // })
      setFieldValue('fullName', newFriendFullName)

      return
    }

    if (typeof newValue === 'string') {
      return
    }
    // setValue(newValue)
    setFieldValue('fullName', newValue)
  }

  const filterOptions = (
    options: ParticipantsOption[],
    params: FilterOptionsState<ParticipantsOption>
  ) => {
    const filtered = filter(options, params)
    const { inputValue } = params

    const isExisting = options.some(
      (option: { fullName: any }) => inputValue === option.fullName
    )
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        fullName: `Add "${inputValue}"`,
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
        options={friends}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => <li {...props}>{option.fullName}</li>}
        freeSolo
        autoHighlight={true}
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
