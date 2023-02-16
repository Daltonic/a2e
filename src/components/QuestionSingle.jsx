import { Link } from "react-router-dom";
import Identicon from "react-identicons";
import { truncate } from "../store";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { setGlobalState } from "../store";
import UpdateQuestion from './UpdateQuestion';
import DeleteQuestion from "./DeleteQuestion";

const QuestionSingle = ({question}) => {

  const handleEdit = (question)=> {
    setGlobalState('singleQuestion',question)
     setGlobalState('updateModal','scale-100')
  }
  const handleDelete = (question)=> {
    setGlobalState('singleQuestion',question)
     setGlobalState('deleteQuestionModal','scale-100')
  }

  return (
    <div className="ml-10 text-start mb-5 w-full">
      <Link to={`/question/${question.id}`}>
        <h1 className="text-xl font-bold mb-2">{question.title}</h1>
      </Link>
      <p>{question.description}</p>
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
      <div className="flex justify-between items-center flex-wrap my-4 w-full">
        <div className="flex space-x-2 justify-center">
          {
           question.tags.split(',').map((tag,index)=>(
          <span key={index} className="px-4 py-2.5 rounded bg-blue-100 text-blue-400 font-medium text-xs flex align-center w-max cursor-pointer active:bg-blue-300 transition duration-300 ease">
            {tag}
          </span>
           )) 
          }
        </div>
        <div className="flex justify-center items-center space-x-2">
          <Identicon string="randomness" size={20} className="rounded-full" />
          <p>{truncate(question.owner, 4, 4, 11)}</p>
        </div>
      </div>
        {question ? <UpdateQuestion /> : null}
        {question ? <DeleteQuestion /> : null}
    </div>
  );
}

export default QuestionSingle
