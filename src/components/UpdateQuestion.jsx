import { FaTimes } from "react-icons/fa";
import { setGlobalState, useGlobalState } from "../store";
import { editQuestion, getQuestions } from "../services/blockchain";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const UpdateQuestion = () => {
  const [singleQuestion] = useGlobalState("singleQuestion");
  const [updateModal] = useGlobalState("updateModal");
  const [question, setQuestion] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (singleQuestion) {
      setQuestion(singleQuestion.description);
      setTitle(singleQuestion.title);
      setTags(singleQuestion.tags);
    }
  }, [singleQuestion]);

  const resetForm = () => {
    setQuestion("");
    setTitle("");
    setTags("");
  };

  const handleClose = () => {
    setGlobalState("singleQuestion", null);
    setGlobalState("updateModal", "scale-0");
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question == "" || title == "" || tags == "") return;
    const params = {
      id: singleQuestion.id,
      title,
      question,
      tags,
    };

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await editQuestion(params)
          .then(async () => {
            setGlobalState("updateModal", "scale-0");
            await getQuestions();
            handleClose();
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "question updated successfully 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${updateModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Add Question</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={handleClose}
            >
              <FaTimes className="text-gray-400 hover:text-blue-400" />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-40 shadow-md shadow-slate-300 p-4">
              <p className="text-lg font-bold text-slate-700">
                {" "}
                A<b className="text-orange-500">2</b>E
              </p>
            </div>
            <p className="p-2">Add your question below</p>
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-300 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Question Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-300 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="separate tags with commas, eg. php,css,html"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-300 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              type="text"
              name="question"
              placeholder="Drop your question here."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
  );
};

export default UpdateQuestion;
