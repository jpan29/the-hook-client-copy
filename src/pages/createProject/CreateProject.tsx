import './createProject.css'

import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { GET_PROJECTS } from '../../contexts/project'

import { ProjectContext } from '../../contexts/project'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'testing', label: 'Testing' },
  { value: 'deployment', label: 'Deployment' },
  { value: 'marketing', label: 'Marketing' },
]
interface List {
  value: string
  label: string
}

const GET_USERS = gql`
  query {
    users {
      name
      id
    }
  }
`

const CREATE_PROJECT = gql`
  mutation (
    $projectName: String!
    $details: String!
    $dueDate: String!
    $category: String!
    $userIds: [UserId!]!
  ) {
    projectCreate(
      projectName: $projectName
      details: $details
      dueDate: $dueDate
      category: $category
      userIds: $userIds
    ) {
      projectErrors {
        message
      }
    }
  }
`

const CreateProject = () => {
  const navigate = useNavigate()
  //project state
  const [errorMsg, setErrorMsg] = useState('')
  const [userList, setUserList] = useState<List[]>([])
  const [projectName, setProjectName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState<List | null>(null)
  const [assignedUsers, setAssignedUsers] = useState<List[]>([])
  //form error
  const [formError, setFormError] = useState<String | null>(null)
  //project context
  const value = useContext(ProjectContext)
  //get users query
  const { data: user, error, loading } = useQuery(GET_USERS)
  const [
    createProject,
    { data: createData, error: createError, loading: createLoading },
  ] = useMutation(CREATE_PROJECT)

  useEffect(() => {
    if (user) {
      const { users } = user
      //@ts-ignore
      const userList = users.map((user) => {
        const { id, name } = user
        return { value: id, label: name }
      }) as List[]

      setUserList(userList)
    }
  }, [user])

  useEffect(() => {
    setErrorMsg('')

    if (createData) {
      const { projectCreate } = createData
      if (projectCreate.projectErrors.length > 0)
        return setErrorMsg(projectCreate.projectErrors[0].message)
      navigate('/')
    }
  }, [createData])

  if (error) {
    return <div className="error">error</div>
  }
  if (loading) {
    return <div>loading...</div>
  }

  const createProjectHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    if (!category) return setFormError('Please select a category')
    if (assignedUsers.length === 0)
      return setFormError('Please assign the project to at least one user')
    const users = assignedUsers.map((user) => {
      const userId = Number(user.value)
      return { id: userId }
    })

    createProject({
      variables: {
        projectName,
        details,
        dueDate,
        category: category.label,
        userIds: users,
      },
      refetchQueries: [
        { query: GET_PROJECTS, variables: { category: 'All' } },
        { query: GET_PROJECTS, variables: { category: category.label } },

        {
          query: GET_PROJECTS,
          variables: { category: 'Mine' },
        },
      ],
    })
  }

  return (
    <div className="createForm__container">
      <h2 className="createForm__title">Create a new project</h2>
      <form onSubmit={createProjectHandler}>
        <label>
          <span>Project name</span>
          <input
            type="text"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </label>
        <label>
          <span>Details</span>
          <textarea
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>
        <label>
          <span>Due date</span>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <label>
          <span>Project category</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        <label>
          <span>Assign to</span>
          <Select
            options={userList}
            //@ts-ignore
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>
        {formError && <div className="error">{formError}</div>}
        {errorMsg && <div className="error">{errorMsg}</div>}
        <button className="btn">
          {createLoading ? 'Waiting...' : 'Add Project'}
        </button>
      </form>
    </div>
  )
}
export default CreateProject
