import { Link } from 'react-router-dom'
import Identicon from 'react-identicons'
import { truncate } from '../store'
import { FaPenAlt, FaTrashAlt } from 'react-icons/fa'
import { setGlobalState } from '../store'

const QuestionSingle = ({ question, titled, editable }) => {
  const handleEdit = (question) => {
    setGlobalState('singleQuestion', question)
    setGlobalState('updateModal', 'scale-100')
  }
  const handleDelete = (question) => {
    setGlobalState('singleQuestion', question)
    setGlobalState('deleteQuestionModal', 'scale-100')
  }

  return (
    <div className="text-start mb-5 w-full">
      {titled ? (
        <Link to={`/question/${question.id}`}>
          <h1 className="text-xl font-medium mb-2">{question.title}</h1>
        </Link>
      ) : null}
      <p className='text-sm'>{question.description}</p>
      {editable ? (
        <div className="flex space-x-3 my-3">
          <FaPenAlt
            className="text-xs text-blue-500 cursor-pointer"
            onClick={() => handleEdit(question)}
          />
          <FaTrashAlt
            className="text-xs text-red-500 cursor-pointer"
            onClick={() => handleDelete(question)}
          />
        </div>
      ) : null}
      <div className="flex justify-between items-center flex-wrap my-4 w-full">
        <div className="flex space-x-2 justify-center">
          {question.tags.split(',').map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded bg-blue-100 text-blue-400
              font-medium text-xs flex align-center w-max cursor-pointer
              active:bg-blue-300 transition duration-300 ease"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-center items-center space-x-2">
          <Identicon
            string={question.owner}
            size={20}
            className="rounded-full"
          />
          <p className='text-sm font-semibold'>{truncate(question.owner, 4, 4, 11)}</p>
        </div>
      </div>
    </div>
  )
}

export default QuestionSingle
