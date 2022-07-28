import ProjectList from '../../components/ProjectList'
import ProjectFilter from './ProjectFilter'
import './dashboard.css'
import { ProjectContext } from '../../contexts/project'
import { useContext } from 'react'
import Spinner from '../../components/Spinner'

const Dashboard = () => {
  const value = useContext(ProjectContext)
  const filterHandler = (newFilter: string) => {
    value?.setCurrentFilter(newFilter)
  }

  return (
    <div className="dashboard__container">
      <h2 className="dashboard__title"> Dashboard</h2>

      {value?.projects && (
        <>
          <ProjectFilter
            currentFilter={value.currentFilter}
            filterHandler={filterHandler}
          />
          {value?.loading ? (
            <Spinner />
          ) : (
            <ProjectList projects={value?.projects} />
          )}
        </>
      )}
    </div>
  )
}
export default Dashboard
