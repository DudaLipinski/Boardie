export const styledAvatarGroup = {
  justifyContent: 'flex-end',
  margin: '16px 0 8px 0',
  gap: '12px',
  '& .MuiBadge-badge': {
    padding: '0',
    bottom: '0px',
    right: '6px',
    marginTop: '6px',
    border: '2.5px solid white',
    boxSizing: 'content-box',
    borderRadius: 'var(--border-radius)',
  },

  '.MuiBadge-root:last-child': {
    marginLeft: 'var(--border-radius)',
  },

  '& .MuiAvatar-root': {
    border: '0px',
    width: '38px',
    height: '38px',
    fontSize: '14px',
    bgcolor: 'var(--color-secondary)',
  },
}
