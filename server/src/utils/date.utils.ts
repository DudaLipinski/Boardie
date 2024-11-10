import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const utcToMysql = (utcDate?: string | null) => {
  return utcDate ? dayjs.utc(utcDate).format('YYYY-MM-DD HH:mm:ss') : ''
}
