import { ListItem, Box } from '@mui/material'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Alert } from '../Alert'
import { Participants } from './Participants'
import { MatchInfo } from './MatchInfo'
import { styledListItem } from './MatchCard.styles'
import { MenuButton } from './MenuButton'
import { Match } from '@/types/Match'
import { getErrorMessage } from '@/utils/api'
import { useMatchDeletion } from '@/queries/match'
import { MATCH_DETAILS } from '@/routes/routeSpecs'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgameName, participants, startedAt } = match
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutate, isError, error } = useMatchDeletion()

  const participantsByScore = useMemo(
    () =>
      participants
        ? participants.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        : [],
    [participants]
  )
  const highestScore = participantsByScore?.[0]?.score ?? null

  const handleDeleteMatch = () => {
    mutate(id)
    setIsDeleteDialogOpen(!isDeleteDialogOpen)
  }

  const message = getErrorMessage(error)

  return (
    <>
      {isError && <Alert severity={'error'} message={message} />}
      <ListItem sx={{ ...styledListItem }}>
        <Box width="92%" paddingTop="6px">
          <Link
            href={`${MATCH_DETAILS.replace(':id', id.toString())}`}
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
