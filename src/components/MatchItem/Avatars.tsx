import { AvatarGroup, Chip, Avatar, Badge } from '@mui/material'
import { Participant } from '../../types/Match'

export const Avatars = ({ participants }: { participants: Participant[] }) => {
  const participantsByScore = participants.sort((a, b) => b.score - a.score)

  const participant = participantsByScore.map((participant) => {
    if (participant.isWinner) {
      return (
        <>
          <Chip
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
                  src="1.jpg"
                  sx={{ width: 32, height: 32, fontSize: '16px' }}
                />
              </Badge>
            }
            label={participant.fullName}
            variant="filled"
          />
        </>
      )
    }

    return (
      <Avatar
        alt={participant.fullName}
        src="1.jpg"
        sx={{ width: 32, height: 32, fontSize: '16px' }}
      />
    )
  })

  return (
    <AvatarGroup
      max={6}
      sx={{
        margin: '18px 0 8px 7px',
        gap: '8px',
        float: 'left',
        '& .MuiBadge-badge': {
          padding: '0',
          bottom: '0px',
          right: '6px',
        },
        '& .MuiAvatar-root': {
          width: '32px',
          height: '32px',
          fontSize: '16px',
        },
        ' .MuiChip-avatar': {
          marginLeft: '0!important',
          width: '32px!important',
          height: '32px!important',
          color: 'white!important',
          fontSize: '16px!important',
          marginTop: '-4px',
        },
      }}
    >
      {participant}
    </AvatarGroup>
  )
}
