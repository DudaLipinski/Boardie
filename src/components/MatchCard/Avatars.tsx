import { AvatarGroup, Chip, Avatar, Badge } from '@mui/material'
import { Participant } from '../../types/Match'
import { styledAvatar, styledAvatarGroup } from './MatchCard.styles'

export const Avatars = ({ participants }: { participants: Participant[] }) => {
  const participantsByScore = participants.sort((a, b) => b.score - a.score)

  const participant = participantsByScore.map((participant, i) => {
    if (participant.isWinner) {
      return (
        <Chip
          key={`${participant.fullName}-${i}`}
          sx={{ marginTop: '2px', marginRight: '2px' }}
          avatar={
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Avatar
                alt={participant.fullName}
                src=""
                sx={{ ...styledAvatar }}
              >
                {participant.fullName[0]}
              </Avatar>
            </Badge>
          }
          label={participant.fullName}
          variant="filled"
        />
      )
    }

    return (
      <Avatar
        key={`${participant.fullName}-${i}`}
        alt={participant.fullName}
        src=""
        sx={{ ...styledAvatar }}
      >
        {participant.fullName[0]}
      </Avatar>
    )
  })

  return (
    <AvatarGroup max={6} sx={{ ...styledAvatarGroup }}>
      {participant}
    </AvatarGroup>
  )
}
