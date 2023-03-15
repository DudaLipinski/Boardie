export const styledListItem = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'start',
  width: '96%',
  margin: '0 auto 16px',
  bgcolor: 'background.paper',
  boxShadow: '2px 2px 13px 0px rgb(0 0 0 / 4%)',
  borderRadius: '8px',
}

export const styledAvatarGroup = {
  justifyContent: 'flex-end',
  margin: '16px 0 8px 0',
  gap: '8px',
  '& .MuiBadge-badge': {
    padding: '0',
    bottom: '0px',
    right: '6px',
  },
  '& .MuiAvatar-root': {
    width: '32px',
    height: '32px',
    fontSize: '14px',
  },
  '.MuiBadge-root:last-child': {
    marginLeft: '8px',
  },
}
