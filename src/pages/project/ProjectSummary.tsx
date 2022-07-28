import { IProject } from '../../contexts/project'
import { useParams, useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import { MouseEvent, useEffect, useState } from 'react'
import { GET_PROJECTS } from '../../contexts/project'

interface IProjectProp {
  project: IProject
}
const DELETE_PROJECT = gql`
  mutation ($projectId: ID!) {
    projectDelete(projectId: $projectId) {
      projectErrors {
        message
      }
    }
  }
`
const ProjectSummary = ({ project }: IProjectProp) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deleteProject, { data, error: deleteError, loading }] =
    useMutation(DELETE_PROJECT)
  const [error, setError] = useState('')

  const deleteProjectHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    deleteProject({
      variables: {
        projectId: id,
      },
      refetchQueries: [
        {
          query: GET_PROJECTS,
          variables: { category: 'All' },
        },
        {
          query: GET_PROJECTS,
          variables: { category: project.category },
        },
        {
          query: GET_PROJECTS,
          variables: { category: 'Mine' },
        },
      ],
    })
  }

  useEffect(() => {
    setError('')
    if (data) {
      const { projectDelete } = data

      if (projectDelete.projectErrors[0].message)
        return setError(projectDelete.projectErrors[0].message)
      navigate('/')
    }
  }, [data])
  return (
    <div>
      <div className="projectSummary__container">
        <h2 className="projectSummary__title">{project.projectName}</h2>
        <p className="projectSummary__createBy">
          Created by {project.createdBy}
        </p>
        <p className="projectSummary__dueDate">
          Due by {new Date(project.dueDate).toDateString()}
        </p>

        <p className="projectSummary__details">{project.details}</p>
        <h4>Project is assigned to:</h4>
        <div className="projectSummary__assignedUsers">
          {project.users.map((user, i) => (
            <div key={i}>
              <p>{user.name}</p>
              {/* <Avatar /> */}
            </div>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <button className="btn" onClick={deleteProjectHandler}>
        {loading ? 'Waiting...' : 'Mark as Complete'}
      </button>
    </div>
  )
}
export default ProjectSummary
