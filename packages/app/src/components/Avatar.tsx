import { Avatar as MuiAvatar, SxProps } from '@mui/material'
import { GenericUser } from '../types/GenericUser'

type Size = 'sm' | 'md' | 'lg'
interface SizeDef {
  side: number
  fontSize: string
}

const placeholderStyle = {
  background: 'var(--color-secondary)',
  border: '2px dashed rgba(255,255,255,0.12)',
}

const sizes: Record<Size, SizeDef> = {
  sm: { side: 38, fontSize: '14px' },
  md: { side: 62, fontSize: '18px' },
  lg: { side: 92, fontSize: '22px' },
}

const getInitials = (fullName?: string) => {
  if (!fullName) {
    return ''
  }

  const splitFullName = fullName.split(' ')
  const firstName = splitFullName[0] ?? ''
  const lastName =
    splitFullName.length > 1 ? splitFullName[splitFullName.length - 1] : ''

  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
}

export const Avatar = ({
  user,
  size,
  sx,
}: {
  user: GenericUser | null
  size: Size
  sx?: Omit<SxProps, 'width' | 'height' | 'fontSize'>
}) => {
  const sizeDef = sizes[size]

  const sizeSx = {
    width: sizeDef.side,
    height: sizeDef.side,
    textTransform: 'uppercase',
    boxSizing: 'border-box',
    fontSize: sizeDef.fontSize,
    backgroundColor: 'var(--color-secondary)',
  }
  const avatarSx = user?.fullName
    ? { ...sizeSx, ...sx }
    : { ...sizeSx, ...placeholderStyle }

  return (
    <MuiAvatar
      alt={user?.fullName || 'Avatar placeholder'}
      src=""
      sx={avatarSx}
    >
      {getInitials(user?.fullName)}
    </MuiAvatar>
  )
}
