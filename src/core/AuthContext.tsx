import { createContext, ReactElement, useContext, useState } from 'react'
import { getTokenFromCookies } from '../utils/api'

const AuthContext = createContext<{
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}>({
  isLoggedIn: false,
  setIsLoggedIn: (value) => {},
})

export const AuthProvider = ({
  children,
}: {
  children: ReactElement | ReactElement[]
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getTokenFromCookies())

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
