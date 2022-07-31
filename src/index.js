import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from "@apollo/client/link/context"
import { UserProvider } from './contexts/user'


const httpLink = createHttpLink({
  //'https://the-hook-apollo-deployment.herokuapp.com/'

  uri: 'http://localhost:4000/graphql',
})


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : ""
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),

})

ReactDOM.render(
  <React.StrictMode>

    <BrowserRouter>

      <ApolloProvider client={client}>

        <UserProvider>

          <App />

        </UserProvider>

      </ApolloProvider>

    </BrowserRouter>
  </React.StrictMode>,


  document.getElementById('root')
)
