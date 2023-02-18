import { FaEthereum, FaPenAlt, FaTrashAlt } from 'react-icons/fa'
import Identicon from 'react-identicons'
import { setGlobalState, useGlobalState, truncate } from '../store'
import { getComments, payWinner } from '../services/blockchain.jsx'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const QuestionComments = () => {
  const [comments] = useGlobalState('comments')
  const [question] = useGlobalState('question')
  const [loaded, setLoaded] = useState(false)

  const { id } = useParams()

  useEffect(async () => {
    await getComments(id).then(() => setLoaded(true))
  }, [])

  return loaded ? (
    <div className="my-4">
      {comments.map((comment, i) =>
        !comment.deleted ? (
          <Comment comment={comment} question={question} key={i} />
        ) : null,
      )}
    </div>
  ) : null
}

const Comment = ({ comment, question }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const handleEdit = () => {
    setGlobalState('comment', comment)
    setGlobalState('updateCommentModal', 'scale-100')
  }

  const handleDelete = () => {
    setGlobalState('comment', comment)
    setGlobalState('deleteCommentModal', 'scale-100')
  }
  const handlePayment = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await payWinner(question.id, comment.id)
          .then(async () => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Winner payed out 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="border-b border-b-gray-300 py-2 flex flex-col justify-center items-start space-y-2">
      <h2 className="text-xs">{comment.commentText}</h2>
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-start items-center space-x-2">
          <p className="text-slate-500 text-sm font-lg">
            {formatTimestamp(comment.createdAt)}
          </p>
          {connectedAccount == comment.owner ? (
            <>
              <button
                className="flex justify-center items-center px-2 py-1 rounded
                border-gray-500 border text-gray-500 space-x-1
                font-medium text-xs align-center w-max cursor-pointer
                transition duration-300 ease"
                onClick={handleEdit}
              >
                <FaPenAlt className="text-xs cursor-pointer" />
                <span>Edit</span>
              </button>

              <button
                className="flex justify-center items-center px-2 py-1 rounded
                border-red-500 border text-red-500 space-x-1
                font-medium text-xs align-center w-max cursor-pointer
                transition duration-300 ease"
                onClick={handleDelete}
              >
                <FaTrashAlt className="text-xs cursor-pointer" />
                <span>Delete</span>
              </button>
            </>
          ) : null}
          {connectedAccount == question.owner && !question.paidout ? (
            <button
              className="flex justify-center items-center px-2 py-1 rounded bg-green-700 text-white
                font-medium text-xs align-center w-max cursor-pointer
                transition duration-300 ease space-x-1"
              onClick={handlePayment}
            >
              <FaEthereum className="text-xs cursor-pointer" />
              <span>Pay Now</span>
            </button>
          ) : null}
        </div>

        <div className="flex justify-start items-center space-x-2">
          <Identicon
            string={comment.owner}
            size={20}
            className="rounded-full"
          />
          <p className="text-sm font-semibold">
            {truncate(comment.owner, 4, 4, 11)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default QuestionComments
