import CasinoIcon from '@mui/icons-material/Casino'
import PeopleIcon from '@mui/icons-material/People'
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'

import {
  CREATE_MATCH,
  DASHBOARD,
  FRIENDS,
  MATCHES,
  PROFILE,
} from '../../routes/routeSpecs'
import { userToGeneric } from '../../utils/friends'
import { User } from '../../types/User'
import { Avatar } from '../Avatar'

export const TabBar = ({ user }: { user: User }) => {
  const genericUser = userToGeneric(user)

  return (
    <>
      <nav className="bg-slate-800">
        <ul className="flex flex-row items-center justify-around px-2">
          <li>
            <Link to={DASHBOARD} aria-label="Dashboard">
              <HomeIcon />
            </Link>
          </li>
          <li>
            <Link to={MATCHES} aria-label="Matches">
              <CasinoIcon />
            </Link>
          </li>
          <li className="relative -top-5 z-10">
            <Link
              to={CREATE_MATCH}
              aria-label="Create Match"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-center "
            >
              <AddIcon />
            </Link>
          </li>
          <li>
            <Link to={FRIENDS} aria-label="Friends">
              <PeopleIcon />
            </Link>
          </li>
          <li>
            <Link to={PROFILE} aria-label="Profile">
              <Avatar user={genericUser} size={'sm'} />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
