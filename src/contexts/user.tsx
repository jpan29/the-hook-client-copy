import { createContext, useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
export interface IUser {
  isOnline: boolean
  name: string
  id: string
}
interface IUserContext {
  currentUser: IUser | null
  users: IUser[]
  setCurrentUser: (user: IUser | null) => IUser | null
  setUsers: (users: IUser[]) => IUser[]
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => boolean
}
export const GET_USERS = gql`
  query {
    users {
      isOnline
      name
      id
    }
  }
`
export const GET_CURRENTUSER = gql`
  query {
    checkAuth {
      user {
        id
        name
        isOnline
      }
    }
  }
`
// actual value you want to access
export const UserContext = createContext<IUserContext | null>({
  currentUser: null,
  users: [],
  setCurrentUser: (user) => user,
  setUsers: (users) => users,
  isLoading: false,
  setIsLoading: (isLoading) => isLoading,
})

export const UserProvider = ({ children }: any) => {
  const { data } = useQuery(GET_USERS)
  const { data: userAuth } = useQuery(GET_CURRENTUSER)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [users, setUsers] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (userAuth) {
      const user = userAuth.checkAuth.user as IUser

      setCurrentUser(user)
    }
  }, [userAuth])

  useEffect(() => {
    if (data) {
      setUsers(data.users)
    }
  }, [data])

  const value = {
    currentUser,
    users,
    setCurrentUser,
    setUsers,
    isLoading,
    setIsLoading,
  } as IUserContext

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
