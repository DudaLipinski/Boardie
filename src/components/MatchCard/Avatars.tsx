import { AvatarGroup, Chip, Avatar, Badge } from '@mui/material'
import { Participant } from '../../types/Match'
import { styledAvatar, styledAvatarGroup } from './MatchCard.styles'

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
              <Avatar alt={fullName} src="" sx={{ ...styledAvatar }}>
                {fullName[0]}
              </Avatar>
            </Badge>
          }
          label={fullName}
          variant="filled"
        />
      )
    }

    return (
      <Avatar
        key={`${fullName}-${i}`}
        alt={fullName}
        src=""
        sx={{ ...styledAvatar }}
      >
        {fullName[0]}
      </Avatar>
    )
  })

  return (
    <AvatarGroup max={6} sx={{ ...styledAvatarGroup }}>
      {participant}
    </AvatarGroup>
  )
}
