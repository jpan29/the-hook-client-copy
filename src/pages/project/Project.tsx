import './project.css'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { IProject } from '../../contexts/project'
import ProjectSummary from './ProjectSummary'
import ProjectComment from './ProjectComment'

import { CommentsProvider } from '../../contexts/comment'

const GET_PROJECT = gql`
  query ($projectId: ID!) {
    project(projectId: $projectId) {
      projectName
      details
      dueDate
      category
      createdBy
      users {
        name
      }
    }
  }
`

const Project = () => {
  const { id } = useParams()
  const [project, setProject] = useState<IProject | null>(null)
  const { data, error, loading } = useQuery(GET_PROJECT, {
    variables: {
      projectId: id,
    },
  })

  useEffect(() => {
    if (data) {
      const project = data.project as IProject
      setProject(project)
    }
  }, [data])
  if (error) {
    return <div className="error">No project exists</div>
  }
  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="project__container">
      <CommentsProvider>
        {project && <ProjectSummary project={project} />}
        <ProjectComment />
      </CommentsProvider>
    </div>
  )
}
export default Project
