import { gql, useMutation, useQuery } from '@apollo/client'
import { useState, createContext, useEffect } from 'react'
export interface IProject {
  id: string
  projectName: string
  details: string
  dueDate: string
  category: string
  createdBy: string
  users: {
    name: string
  }[]
}
interface IProjectContext {
  projects: IProject[]
  project: IProject | null
  setProject: (project: IProject) => IProject
  loading: boolean
  createLoading: boolean
  currentFilter: string
  setCurrentFilter: (filter: string) => string
}

export const GET_PROJECTS = gql`
  query ($category: String!) {
    projects(category: $category) {
      id
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

export const ProjectContext = createContext<IProjectContext | null>({
  projects: [],

  setProject: (project) => project,
  project: null,
  loading: false,
  createLoading: false,
  currentFilter: 'All',
  setCurrentFilter: (filter) => filter,
})

export const ProjectProvider = ({ children }: any) => {
  const [projects, setProjects] = useState<IProject[]>([])
  const [project, setProject] = useState<IProject | null>(null)
  const [currentFilter, setCurrentFilter] = useState('All')
  const { data, error, loading } = useQuery(GET_PROJECTS, {
    variables: {
      category: currentFilter,
    },
  })

  useEffect(() => {
    if (data) {
      setProjects(data.projects)
    }
  }, [data])

  const value = {
    projects,
    loading,
    setProject,

    project,
    currentFilter,
    setCurrentFilter,
  } as IProjectContext
  useEffect(() => {}, [])
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}
