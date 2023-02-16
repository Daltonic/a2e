import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import QuestionSingle from "./QuestionSingle";

const QuestionDescription = ({questions}) => {
  return (
    <div
      className="flex justify-center items-start pt-5 my-4 w-full 
      border-t-2 border-gray-300 border-t-gray-300"
    >
      
      {questions.length > 0 ?
            <AnswersStats questions={questions}/>
        : null
    }

      <div className="flex flex-col w-full">
        {questions.length > 0
          ? questions.map((question, i) => (
              <QuestionSingle
                question={question}
                key={i}
              />
            ))
          : "No question available"}
      </div>
    </div>
  );
};




const AnswersStats = ({questions}) => {
  let sum
  {questions.map((question)=> {
     sum = question.answers++
  })}
  return (
    <div className="flex flex-col items-center justify-center">
      {sum > 0 ? <h2>{sum}</h2> : 0}
      <h2>Answers</h2>
    </div>
  );
};



 {
   /* {questions.questionTitle ? (
          <Link
            to={typeof id != "undefined" ? `/question/${questions.id}` : "#"}
            className="text-lg font-medium"
          >
            {questions.questionTitle}
          </Link>
        ) : null}

        <p>{questions.questionDescription}</p> */
 }

export default QuestionDescription;
