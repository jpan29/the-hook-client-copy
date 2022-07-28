import { gql, useQuery } from '@apollo/client'
import { useState, createContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
export interface IComment {
  id: string
  comment: string
  createdAt: string
  user: {
    name: string
  }
}

export const GET_COMMENTS = gql`
  query ($projectId: ID!) {
    comments(projectId: $projectId) {
      id
      comment
      createdAt
      user {
        name
      }
    }
  }
`
interface ICommentContext {
  comments: IComment[]
  comment: IComment | null
  setComments: (comments: IComment[]) => IComment[]
  setComment: (comment: IComment) => IComment
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => boolean
}

export const CommentsContext = createContext<ICommentContext | null>({
  comments: [],
  setComments: (comments) => comments,
  isLoading: false,
  setIsLoading: (isLoading: boolean) => isLoading,
  comment: null,
  setComment: (comment) => comment,
})

export const CommentsProvider = ({ children }: any) => {
  const { id } = useParams()
  const [comments, setComments] = useState<IComment[]>([])
  const [comment, setComment] = useState<IComment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data, error, loading } = useQuery(GET_COMMENTS, {
    variables: {
      projectId: id,
    },
  })
  useEffect(() => {
    if (data) {
      setComments(data.comments)
    }
  }, [data])

  const value = {
    comments,
    setComments,
    isLoading,
    setIsLoading,
    comment,
    setComment,
  } as ICommentContext
  useEffect(() => {}, [])
  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  )
}
