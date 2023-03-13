import { AvatarGroup, Chip, Badge } from '@mui/material'
import { Avatar } from '../Avatar'
import { Participant } from '../../types/Match'
import { styledAvatarGroup } from './MatchCard.styles'
import { useMemo } from 'react'

export const Participants = ({
  participants,
}: {
  participants: Participant[]
}) => {
  const participantsByScore = useMemo(
    () => participants.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [participants]
  )

  const participant = participantsByScore.map((participant) => {
    const { fullName, id } = participant.friend

    if (participant.isWinner) {
      return (
        <Chip
          key={id}
          sx={{ marginTop: '2px', marginRight: '2px' }}
          avatar={
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Avatar user={participant.friend} size="sm" />
            </Badge>
          }
          label={fullName}
          variant="filled"
        />
      )
    }

    return <Avatar user={participant.friend} size="sm" key={id} />
  })

  return (
    <AvatarGroup max={6} sx={{ ...styledAvatarGroup }}>
      {participant}
    </AvatarGroup>
  )
}
