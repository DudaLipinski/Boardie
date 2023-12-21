import { useSearchBoardgames } from '@src/queries/boardgames'
import { useEffect, useState } from 'react'
import { useDebounced } from '@src/hooks/useDebounced'

type Props = {
  value: Boardgame
  onChange: (boardgame: Boardgame) => void
}
export const BoardgameSearchInput = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState('')
  const [setQueryDebounced] = useDebounced(setQuery, 400)

  const boardgamesQuery = useSearchBoardgames(query)
  const boardgames = boardgamesQuery.data ?? []

  const [showBoardgames, setShowBoardgames] = useState(false)
  useEffect(() => {
    if (boardgamesQuery.isSuccess) {
      setShowBoardgames(true)
    }
  }, [boardgamesQuery.isSuccess])

  const getBoardgameSelectionHandler = (boardgame: Boardgame) => () => {
    onChange(boardgame)
    setShowBoardgames(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryDebounced(event.target.value)
  }

  return (
    <div>
      {value && (
        <div className="flex items-center justify-center rounded-md bg-gray-400 p-3">
          {value.title}
        </div>
      )}

      <input type="text" placeholder="Search" onChange={handleChange} />

      {showBoardgames && (
        <ul>
          {boardgames.map((boardgame) => (
            <li
              key={boardgame.id}
              onClick={getBoardgameSelectionHandler(boardgame)}
            >
              {boardgame.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
