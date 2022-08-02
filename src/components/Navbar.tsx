import './navbar.css'
import Temple from '../assets/temple.svg'
import { Link } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext, GET_CURRENTUSER } from '../contexts/user'

const SIGN_OUT = gql`
  mutation {
    signOut {
      userErrors {
        message
      }
    }
  }
`

const Navbar = () => {
  const [signOut, { data }] = useMutation(SIGN_OUT)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const value = useContext(UserContext)

  const logOutHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    signOut({ refetchQueries: [{ query: GET_CURRENTUSER }] })

    setTimeout(() => {
      value?.setCurrentUser(null)
    }, 3000)
  }

  useEffect(() => {
    if (data) {
      const {
        signOut: { userErrors },
      } = data

      if (userErrors.length > 0) return setError(userErrors[0].message)
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [data])
  return (
    <div className="navbar">
      <ul className="navbar__content">
        <li className="navbar__logo">
          <img src={Temple} alt="logo" />
          <span>The Hook</span>
        </li>
        {value?.currentUser ? (
          <li>
            <button className="btn" onClick={logOutHandler}>
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
export default Navbar
