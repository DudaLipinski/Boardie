import { Autocomplete, TextField } from '@mui/material'

import { useRef, useState } from 'react'
import { useDebounced } from '@src/hooks/useDebounced'
import { useSearchBoardgames } from '@src/queries/boardgames'

interface Props {
  value: Boardgame
  onChange: (boardgame: Boardgame | null) => void
}

export const BoardgameSearchInput = ({ value, onChange }: Props) => {
  const chosenBoardgameTitleExpectedAsInput = useRef<string>()

  const [query, setQuery] = useState('')
  const [setQueryDebounced] = useDebounced(setQuery, 400)

  const boardgamesQuery = useSearchBoardgames(query)
  const boardgames = boardgamesQuery.data ?? []

  const handleNewInputValue = (newInputValue: string) => {
    if (newInputValue === chosenBoardgameTitleExpectedAsInput.current) {
      return
    }

    setQueryDebounced(newInputValue)
  }

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option
    }

    if (option.inputValue) {
      return option.inputValue
    }

    return option.title
  }

  const handleChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: Boardgame | null
  ) => {
    chosenBoardgameTitleExpectedAsInput.current = newValue?.title
    onChange(newValue)
  }

  return (
    <>
      <Autocomplete
        value={value}
        onChange={handleChange}
        filterOptions={(x) => x}
        onInputChange={(_, newInputValue) => {
          handleNewInputValue(newInputValue)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        selectOnFocus
        handleHomeEndKeys
        options={boardgames}
        getOptionLabel={getOptionLabel}
        renderOption={(props, boardgame) => (
          <li {...props}>{boardgame.title}</li>
        )}
        loading={boardgamesQuery.isLoading}
        noOptionsText={query ? 'No results' : 'Start typing'}
        renderInput={(params) => (
          <TextField
            required
            {...params}
            size="medium"
            label="Boardgame"
            placeholder="Search by title"
          />
        )}
        disableClearable
      />
    </>
  )
}
