import { setGlobalState } from '../store'

const QuestionTitle = ({ title, caption }) => {
  return (
    <div
      className="w-full flex justify-between items-center space-x-2
    border-b border-gray-300 border-b-gray-300 pb-4"
    >
      <div className='flex flex-col flex-wrap w-5/6'>
        <h1 className="sm:text-3xl md:2xl text-xl font-medium">{title}</h1>
        <p className="text-md mt-2">{caption}</p>
      </div>

      <button
        type="button"
        className="p-2 px-4 py-3 bg-blue-500 text-white font-medium rounded-md
        text-xs leading-tight capitalize hover:bg-blue-600 focus:outline-none
        focus:ring-0 transition duration-150 ease-in-out"
        onClick={() => setGlobalState('addModal', 'scale-100')}
      >
        Ask question
      </button>
    </div>
  )
}

export default QuestionTitle
