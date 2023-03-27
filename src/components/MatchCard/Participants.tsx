import { AvatarGroup, Badge } from '@mui/material'
import { Avatar } from '../Avatar'
import { Participant } from '../../types/Match'
import { styledAvatarGroup } from './MatchCard.styles'

export const Participants = ({
  participants,
}: {
  participants: Participant[]
}) => {
  const participant = participants.map((participant, index) => {
    const { id } = participant.friend

    if (!participant.isWinner) {
      return (
        <Avatar user={participant.friend} size="sm" key={`${id}-${index}`} />
      )
    }

    return (
      <Badge
        key={id}
        color="warning"
        badgeContent="W"
        variant="dot"
        sx={{
          '.MuiBadge-badge': {
            background: 'var(--adm-color-gold)',
          },
        }}
      >
        <Avatar user={participant.friend} size="sm" />
      </Badge>
    )
  })

  return (
    <AvatarGroup max={4} sx={{ ...styledAvatarGroup }}>
      {participant}
    </AvatarGroup>
  )
}
