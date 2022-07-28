import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useContext } from 'react'
import { CommentsContext, GET_COMMENTS } from '../../contexts/comment'

const CREATE_COMMENT = gql`
  mutation ($comment: String!, $projectId: ID!) {
    commentCreate(comment: $comment, projectId: $projectId) {
      commentErrors {
        message
      }
    }
  }
`
const ProjectComment = () => {
  const value = useContext(CommentsContext)
  const { id } = useParams()
  const [errorMsg, setErrorMsg] = useState('')
  const [content, setContent] = useState('')

  const [createComment, { data: createData, error, loading }] =
    useMutation(CREATE_COMMENT)

  useEffect(() => {
    setErrorMsg('')

    if (createData) {
      const { commentCreate } = createData
      if (commentCreate.commentErrors.length > 0)
        return setErrorMsg(commentCreate.commentErrors[0].message)
    }
  }, [createData])

  const setCommentHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setContent(e.target.value)
  }
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createComment({
      variables: {
        comment: content,
        projectId: id,
      },
      refetchQueries: [{ query: GET_COMMENTS, variables: { projectId: id } }],
    })
    setContent('')
  }

  return (
    <div className="comment__container">
      <h4>Project Comments</h4>

      {value?.comments.length === 0 && <p>No comments yet!</p>}
      <ul>
        {value?.comments.map((el) => (
          <li key={el.id}>
            <div className="commentBy">
              {/* <Avatar /> */}
              <p>{el.user.name}</p>
            </div>
            <div className="commentAt">
              <p>
                {formatDistanceToNow(new Date(Number(el.createdAt)), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="comment__content">
              <p>{el.comment}</p>
            </div>
          </li>
        ))}
      </ul>
      <form className="comment--add" onSubmit={submitHandler}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={setCommentHandler}
            value={content}></textarea>
        </label>
        {errorMsg && <div className="error">{errorMsg}</div>}

        <button className="btn">
          {loading ? 'Waiting...' : 'Add comment'}
        </button>
      </form>
    </div>
  )
}
export default ProjectComment
