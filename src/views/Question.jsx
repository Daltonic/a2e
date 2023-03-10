import QuestionSingle from '../components/QuestionSingle'
import QuestionTitle from '../components/QuestionTitle'
import { useGlobalState, returnTime, setGlobalState } from '../store'
import { getQuestion } from '../services/blockchain'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import QuestionComments from '../components/QuestionComments'
import ChatModal from '../components/ChatModal'
import AuthChat from '../components/AuthChat'
import AddComment from '../components/AddComment'
import { getGroup } from '../services/Chat'
import ChatCommand from '../components/ChatCommand'
import UpdateComment from '../components/UpdateComment'
import DeleteComment from '../components/DeleteComment'

const Question = () => {
  const [question] = useGlobalState('question')
  const [group] = useGlobalState('group')
  const [comment] = useGlobalState('comment')
  const [currentUser] = useGlobalState('currentUser')
  const [loaded, setLoaded] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [connectedAccount] = useGlobalState('connectedAccount')
  const { id } = useParams()

  useEffect(async () => {
    setIsOnline(currentUser?.uid.toLowerCase() == connectedAccount)

    await getQuestion(id).then(() => setLoaded(true))
    await getGroup(`guid_${id}`).then((Group) => {
      setGlobalState('group', Group)
    })
  }, [])

  const handleChat = () => {
    if (isOnline && (!group || !group.hasJoined)) {
      setGlobalState('chatCommandModal', 'scale-100')
    } else if (isOnline && group && group.hasJoined) {
      setGlobalState('chatModal', 'scale-100')
    } else {
      setGlobalState('authChatModal', 'scale-100')
    }
  }

  return loaded ? (
    <div className="sm:px-20 px-5 my-4">
      <QuestionTitle
        title={question.title}
        caption={`Asked ${returnTime(question.createdAt)}`}
      />

      <div className="my-4">
        <QuestionSingle
          editable={question.owner == connectedAccount}
          question={question}
        />
      </div>

      <div className="flex space-x-5 border-b border-b-gray-300 pb-4">
        <button
          className="mt-5 text-blue-500 focus:outline-none focus:ring-0"
          onClick={() => setGlobalState('addComment', 'scale-100')}
        >
          Add Comment
        </button>
        <button
          className="mt-5 text-blue-500 focus:outline-none focus:ring-0"
          onClick={handleChat}
        >
          Chat
        </button>
      </div>

      <AddComment />
      <QuestionComments />
      {comment ? (
        <>
          <UpdateComment />
          <DeleteComment />
        </>
      ) : null}

      <AuthChat />
      <ChatCommand question={question} />
      <ChatModal />
    </div>
  ) : null
}

export default Question
