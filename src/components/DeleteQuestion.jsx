import { useState, useEffect } from "react";
import { deleteQuestion, getQuestions } from "../services/blockchain";
import { setGlobalState, useGlobalState } from "../store";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const DeleteQuestion = () => {
  const [singleQuestion] = useGlobalState("singleQuestion");
  const [deleteQuestionModal] = useGlobalState("deleteQuestionModal");
  const navigate = useNavigate();

  const handleClose = () => {
    setGlobalState("singleQuestion", null);
    setGlobalState("deleteQuestionModal", "scale-0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await deleteQuestion(singleQuestion.id)
          .then(async () => {
            getQuestions();
            handleClose();
            resolve();
            navigate("/");
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "question deleted successfully 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${deleteQuestionModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Delete Comment</p>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-40 shadow-md shadow-slate-300 p-4 mb-4">
              <p className="text-lg font-bold text-slate-700">
                {" "}
                A<b className="text-orange-500">2</b>E
              </p>
            </div>
            <RiErrorWarningFill className="text-6xl text-red-700 " />
            <p className="p-2">Are you sure you want to delete this comment</p>
          </div>

          <div className="flex space-x-4 justify-between">
            <button
              className=" py-2 px-4 bg-orange-500 text-white rounded-sm"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button className="py-2 px-4 bg-red-500 text-white rounded-sm">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteQuestion;
