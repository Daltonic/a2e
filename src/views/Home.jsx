import QuestionTitle from '../components/QuestionTitle'
import { useState, useEffect } from 'react'
import { useGlobalState } from '../store'
import { getQuestions } from '../services/blockchain'
import QuestionSingle from '../components/QuestionSingle'

const QuestionPage = () => {
  const [loaded, setLoaded] = useState(false)
  const [questions] = useGlobalState('questions')

  useEffect(async () => {
    await getQuestions().then(() => {
      setLoaded(true)
    })
  }, [])

  return loaded ? (
    <div className="sm:px-20 px-5 my-4">
      <QuestionTitle
        title={'Ask Questions'}
        caption={`${
          questions.length > 1
            ? questions.length + ' Questions'
            : questions.length + ' Question'
        }`}
      />

      <div className="my-4">
        {questions.map((question, i) => (
          <QuestionSingle question={question} titled key={i} />
        ))}
      </div>
    </div>
  ) : null
}

export default QuestionPage
