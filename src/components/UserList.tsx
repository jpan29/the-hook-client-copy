import './userList.css'
import Avatar from './Avatar'

import { useContext } from 'react'

import { UserContext } from '../contexts/user'

const UserList = () => {
  const value = useContext(UserContext)

  return (
    <div className="userList__container">
      <h2>All Users</h2>
      {value?.users.map((user) => (
        <div className="userList__item" key={user.id}>
          {user.isOnline && <span className="userList__item--online"></span>}
          <span>{user.name}</span>
          {/* <Avatar /> */}
        </div>
      ))}
    </div>
  )
}
export default UserList
