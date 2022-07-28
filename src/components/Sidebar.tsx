import { NavLink } from 'react-router-dom'
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'
import './sidebar.css'
import Avatar from './Avatar'
import { useContext } from 'react'
import { UserContext } from '../contexts/user'

const Sidebar = () => {
  const value = useContext(UserContext)

  return (
    <div className="sidebar">
      <div className="sidebar__content">
        <div className="sidebar__user">
          {/* <Avatar /> */}
          <p>Hey {value?.currentUser?.name} 🤗</p>
        </div>
        <nav className="sidebar__links">
          <ul>
            <li>
              <NavLink to="/" end>
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <img src={AddIcon} alt="add icon" />
                <span>Create Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
export default Sidebar
