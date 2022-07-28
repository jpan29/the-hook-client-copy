import { IProject } from '../contexts/project'
import { Link } from 'react-router-dom'
import './projectList.css'

interface IProjectProps {
  projects: IProject[]
}

const ProjectList = ({ projects }: IProjectProps) => {
  return (
    <div className="projectLsit__container">
      {projects.length === 0 && <p>No projects yet!</p>}
      {projects.map((project) => (
        <Link key={project.id} to={`/project/${project.id}`}>
          <h4>{project.projectName}</h4>

          <p>Due by {new Date(project.dueDate).toDateString()}</p>
          <div className="assignedTo">
            <ul>
              {project.users.map((user, i) => (
                <li key={i}>
                  <p>{user.name}</p>

                  {/* <Avatar /> */}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  )
}
export default ProjectList
