export const styledListItem = {
  bgcolor: 'background.paper',
  marginBottom: '10px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export const styledAvatarGroup = {
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
}

export const styledAvatar = {
  width: 32,
  height: 32,
  fontSize: '16px',
}
