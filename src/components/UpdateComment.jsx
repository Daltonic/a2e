import { FaGithub, FaTimes } from 'react-icons/fa'
import { setGlobalState, useGlobalState } from '../store'
import { useEffect, useState } from 'react'
import { editComment, getComments } from '../services/blockchain.jsx'
import { toast } from 'react-toastify'

const UpdateComment = () => {
  const [updateCommentModal] = useGlobalState('updateCommentModal')
  const [comment] = useGlobalState('comment')
  const [commentText, setCommentText] = useState('')

  const onClose = () => {
    setGlobalState('updateCommentModal', 'scale-0')
    setCommentText('')
    setGlobalState('comment', null)
  }

  useEffect(() => {
    if (comment) {
      setCommentText(comment.commentText)
    }
  }, [comment])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (commentText == '') return
    const params = {
      questionId: comment.questionId,
      commentId: comment.id,
      commentText,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await editComment(params)
          .then(async () => {
            setGlobalState('updateCommentModal', 'scale-0')
            getComments(comment.questionId)
            setCommentText('')
            onClose()
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'comment updated successfully 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${updateCommentModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Update Comment</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={onClose}
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-40 shadow-md shadow-slate-300 p-4">
              <p className="text-lg font-bold text-slate-700">
                {' '}
                A<b className="text-orange-500">2</b>E
              </p>
            </div>
            <p className="p-2">Update your comment below</p>
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-300 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Description"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="flex flex-row justify-center items-center w-full text-white text-md bg-blue-400 py-2 px-5 rounded-full drop-shadow-xl border border-transparent hover:bg-transparent hover:text-blue-400 hover:border hover:border-blue-400 focus:outline-none focus:ring mt-5"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
export default UpdateComment
