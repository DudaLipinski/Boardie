import { AvatarGroup, Badge } from '@mui/material'
import { Avatar } from '../Avatar'
import { Player } from '../../types/Match'
import { styledAvatarGroup } from './MatchCard.styles'

export const Players = ({ players }: { players: Player[] }) => {
  const player = players.map((player, index) => {
    const { id } = player.friend

    if (!player.isWinner) {
      return <Avatar user={player.friend} size="sm" key={`${id}-${index}`} />
    }

    return (
      <Badge
        key={id}
        color="warning"
        badgeContent="W"
        variant="dot"
        sx={{
          '.MuiBadge-badge': {
            background: 'var(--color-warning)',
          },
        }}
      >
        <Avatar user={player.friend} size="sm" />
      </Badge>
    )
  })

  return (
    <AvatarGroup max={4} sx={{ ...styledAvatarGroup }}>
      {player}
    </AvatarGroup>
  )
}
