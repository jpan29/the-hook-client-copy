import { FormEvent, useEffect, useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'

import './signup.css'
import { UserContext, GET_USERS } from '../../contexts/user'

const SIGN_UP = gql`
  mutation ($credentials: CredentialsInput!, $name: String!) {
    signup(credentials: $credentials, name: $name) {
      userErrors {
        message
      }
      user {
        name
        isOnline
      }
      token
    }
  }
`

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userPhoto, setUserPhoto] = useState(null)
  const [error, setError] = useState('')
  const [signup, { data, error: dataError, loading }] = useMutation(SIGN_UP)

  const value = useContext(UserContext)

  const resetFields = () => {
    setName('')
    setEmail('')
    setPassword('')

    setConfirmPassword('')
  }

  const signupHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) return setError('Passwords are not same')

    signup({
      variables: {
        credentials: {
          email,
          password,
        },
        name,
        file: userPhoto,
      },
      refetchQueries: [{ query: GET_USERS }],
    })
    resetFields()
  }
  useEffect(() => {
    setError('')
    if (data) {
      const {
        signup: { userErrors, user, token },
      } = data

      if (userErrors.length > 0) return setError(userErrors[0].message)
      if (token) localStorage.setItem('token', token)

      value?.setCurrentUser(user)
    }
  }, [data])

  return (
    <form className="auth__container" onSubmit={signupHandler}>
      <h2>Sign up</h2>
      <label>
        <span>Name</span>
        <input
          type="text"
          required
          value={name}
          placeholder=""
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        <span>Email</span>
      </label>
      <input
        type="email"
        required
        value={email}
        placeholder=""
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>
        <span>Password</span>
        <input
          type="password"
          required
          value={password}
          placeholder=""
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <label>
        <span>Confirm Password</span>
        <input
          type="password"
          required
          value={confirmPassword}
          placeholder=""
          minLength={6}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>

      {error && <div className="error">{error}</div>}
      <button className="btn">{loading ? 'Waiting...' : 'Sign up'}</button>
    </form>
  )
}
export default Signup
