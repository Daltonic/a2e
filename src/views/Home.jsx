import React from "react";
import QuestionDescription from "../components/QuestionDescription";
import QuestionTitle from "../components/QuestionTitle";
import { useState,useEffect } from "react";
import { useGlobalState } from "../store";
import { getQuestions } from "../services/blockchain";

const QuestionPage = () => {
  const [loaded,setLoaded] = useState(false)
  const [questions] = useGlobalState('questions')

  useEffect(async () => {
    await getQuestions().then(()=> {
      setLoaded(true)
    })
    
  }, []);

  return loaded ? (
    <div className="w-4/5 mx-auto">
      <QuestionTitle title={"Ask Questions"} caption={`${questions.length > 1?questions.length+'questions':questions.length+' question'}`} />
      
      

      <QuestionDescription questions={questions}/>
    </div>
  ) : null;
};

export default QuestionPage;
