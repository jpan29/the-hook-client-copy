import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'

import { ProjectProvider } from './contexts/project'
import { useContext, lazy, Suspense } from 'react'
import { UserContext } from './contexts/user'
import Spinner from './components/Spinner'
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const Signup = lazy(() => import('./pages/signup/Signup'))
const Login = lazy(() => import('./pages/login/Login'))
const Project = lazy(() => import('./pages/project/Project'))
const CreateProject = lazy(() => import('./pages/createProject/CreateProject'))
const Navbar = lazy(() => import('./components/Navbar'))
const Sidebar = lazy(() => import('./components/Sidebar'))
const UserList = lazy(() => import('./components/UserList'))

function App () {

  const value = useContext(UserContext)

  return (
    <Suspense fallback={Spinner}>
      <ProjectProvider>
        <div className='App'>

          {value?.currentUser && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>

              <Route path='/' element={value?.currentUser ? <Dashboard /> : <Navigate to='/login' />} />

              <Route path='/project/:id' element={value?.currentUser ? <Project /> : <Navigate to='/login' />} />

              <Route path='/create' element={value?.currentUser ? <CreateProject /> : <Navigate to='/login' />} />


              <Route path='/login' element={value?.currentUser ? <Navigate to='/' /> : <Login />} />

              <Route path='/signup' element={value?.currentUser ? <Navigate to='/' /> : <Signup />} />





            </Routes>
          </div>
          {value.currentUser && <UserList />}
        </div>

      </ProjectProvider>
    </Suspense>
  )
}

export default App
