import { FormEvent, useContext, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import './login.css'
import { GET_USERS, UserContext } from '../../contexts/user'

const SIGN_IN = gql`
  mutation ($credentials: CredentialsInput!) {
    signin(credentials: $credentials) {
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
const Login = () => {
  const [email, setEmail] = useState('littlemy@hook.com')
  const [password, setPassword] = useState('test123123')
  const [signin, { data, error, loading }] = useMutation(SIGN_IN)
  const [errorMsg, setErrorMsg] = useState('')

  const value = useContext(UserContext)

  const signinHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signin({
      variables: {
        credentials: {
          email,
          password,
        },
      },
      refetchQueries: [{ query: GET_USERS }],
    })
  }

  useEffect(() => {
    setErrorMsg('')
    if (data) {
      const {
        signin: { userErrors, user, token },
      } = data

      if (userErrors.length > 0) return setErrorMsg(userErrors[0].message)
      value?.setCurrentUser(user)
      if (token) localStorage.setItem('token', token)
    }
  }, [data])

  return (
    <>
      <form className="login__container" onSubmit={signinHandler}>
        <h2>Log in</h2>
        <label>
          <span>Email</span>
        </label>
        <input
          type="email"
          value={email}
          placeholder=""
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            placeholder=""
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {errorMsg && <div className="error">{errorMsg}</div>}

        <button className="btn">{loading ? 'Waiting...' : 'Log in'}</button>
      </form>
      <div className="tips">
        <p>
          Please use littlemy@hook.com/test123123 to login or you are welcome to
          create your own account to get access😊
        </p>
      </div>
    </>
  )
}
export default Login
