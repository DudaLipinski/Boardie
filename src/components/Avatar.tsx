import { Avatar as MuiAvatar, SxProps } from '@mui/material'
import { GenericUser } from '../types/GenericUser'

type Size = 'sm' | 'md' | 'lg'
interface SizeDef {
  side: number
  fontSize: number
}

const sizes: Record<Size, SizeDef> = {
  sm: { side: 32, fontSize: 14 },
  md: { side: 62, fontSize: 16 },
  lg: { side: 92, fontSize: 16 },
}

export const Avatar = ({
  user,
  size,
  sx,
}: {
  user: GenericUser
  size: Size
  sx?: Omit<SxProps, 'width' | 'height' | 'fontSize'>
}) => {
  const fullName = user?.fullName ?? ''
  const splitFullName = fullName.split(' ')
  const firstName = splitFullName[0] ?? ''
  const lastName =
    splitFullName.length > 1 ? splitFullName[splitFullName.length - 1] : ''
  const sizeDef = sizes[size]

  return (
    <MuiAvatar
      alt={fullName}
      src=""
      sx={{ width: sizeDef.side, height: sizeDef.side, ...sx }}
    >
      {firstName[0]?.toUpperCase()}
      {lastName[0]?.toUpperCase()}
    </MuiAvatar>
  )
}
