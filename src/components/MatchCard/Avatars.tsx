import { AvatarGroup, Chip, Badge } from '@mui/material'
import { Avatar } from '../Avatar'
import { Participant } from '../../types/Match'
import { styledAvatarGroup } from './MatchCard.styles'

export const Avatars = ({ participants }: { participants: Participant[] }) => {
  const participantsByScore = participants.sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  )

  const participant = participantsByScore.map((participant, i) => {
    const { fullName } = participant.friend

    if (participant.isWinner) {
      return (
        <Chip
          key={`${fullName}-${i}`}
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

    return <Avatar user={participant.friend} size="sm" />
  })

  return (
    <AvatarGroup max={6} sx={{ ...styledAvatarGroup }}>
      {participant}
    </AvatarGroup>
  )
}
