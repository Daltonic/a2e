import { RiSecurePaymentLine } from "react-icons/ri";
import { setGlobalState, useGlobalState } from "../store";
import { FaTimes } from "react-icons/fa";
import { payWinner, getComments } from "../services/blockchain";
import { toast } from "react-toastify";
import { useState } from "react";

const Payment = () => {
  const [paymentModal] = useGlobalState("paymentModal");
  const [comment] = useGlobalState("comment");
  const [amount, setAmount] = useState(0);

  const handleClose = () => {
    setGlobalState("comment", null);
    setGlobalState("paymentModal", "scale-0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) return;
    const params = {
      questionId: comment.questionId,
      commentId: comment.id,
      amount,
    };
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await payWinner(params)
          .then(async () => {
            setGlobalState("paymentModal", "scale-0");
            getComments(comment.questionId);
            setAmount(0);
            handleClose();
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "payment successful 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${paymentModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Confirm payment</p>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-40 shadow-md shadow-slate-300 p-4 mb-4">
              <p className="text-lg font-bold text-slate-700">
                {" "}
                A<b className="text-orange-500">2</b>E
              </p>
            </div>
            <RiSecurePaymentLine className="text-6xl text-orange-700 " />
            <p className="p-2">Confirm payments</p>
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-300 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
              type="number"
              name="title"
              step={"0.001"}
              placeholder="Question Title"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-4 justify-between my-4">
            <button
              className=" py-2 px-4 bg-orange-500 text-white rounded-sm focus:outline-none focus:ring-0"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button className="py-2 px-4 bg-blue-500 text-white rounded-sm focus:outline-none focus:ring-0">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
