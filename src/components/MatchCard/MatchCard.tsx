import { Match } from '../../types/Match'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../../utils/api'
import { useMatchDeletion } from '../../queries/match'

import { ListItem, Box } from '@mui/material'

import { Participants } from './Participants'
import { MatchInfo } from './MatchInfo'
import { styledListItem } from './MatchCard.styles'
import { MATCH_DETAILS } from '../../routes/routeSpecs'
import { MenuButton } from './MenuButton'
import { useMemo, useState } from 'react'
import { Alert } from '../Alert'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgameName, participants, startedAt } = match
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutate, isError, error } = useMatchDeletion()

  const participantsByScore = useMemo(
    () => participants.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [participants]
  )
  const highestScore = participantsByScore?.[0]?.score ?? null

  const handleDeleteMatch = () => {
    mutate(123)
    setIsDeleteDialogOpen(!isDeleteDialogOpen)
  }

  const message = getErrorMessage(error)

  const score = participantsByScore[0].score

  return (
    <>
      {isError && (
        <Alert
          severity={'error'}
          message={message}
          sx={{
            position: 'relative',
            marginBottom: '0',
            borderRadius: '4px 4px 0 0',
          }}
        />
      )}
      <ListItem
        sx={{
          ...styledListItem,
          borderRadius: isError ? '0 0 4px 4px' : '4px',
        }}
      >
        <Box width="92%" paddingTop="6px">
          <Link
            to={`${MATCH_DETAILS.replace(':id', id.toString())}`}
            style={{ textDecoration: 'none' }}
          >
            <MatchInfo
              boardgameName={boardgameName}
              date={startedAt}
              highestScore={highestScore}
            />
            <Participants participants={participantsByScore} />
          </Link>
        </Box>
        <Box width="8%" height="auto">
          <MenuButton
            id={id}
            handleDeleteMatch={handleDeleteMatch}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </Box>
      </ListItem>
    </>
  )
}
