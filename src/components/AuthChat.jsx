import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { setGlobalState, useGlobalState } from "../store";
import { signUpWithCometChat, loginWithCometChat, getMessages } from "../services/Chat";
import { toast } from "react-toastify";

const AuthChat = ({ question, status }) => {
  const [authChatModal] = useGlobalState("authChatModal");

  const handleClose = () => {
    setGlobalState("authChatModal", "scale-0");
  };

  const handleSignUp = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat()
          .then((user) => {
            setGlobalState("currentUser", user);
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "processing...",
        success: "account created successfully , please login 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  const retrieveMessages = async ()=> {
    await getMessages(`guid_${question.id}`).then((msgs) => {
       setGlobalState("messages", msgs)
    });
  }

  const handleLogin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat()
          .then(async (user) => {
            setGlobalState("currentUser", user);
            handleClose();
            if (!status) {
              setGlobalState("chatCommandModal", "scale-100");
            } else {
              await retrieveMessages()
              setGlobalState("chatModal", "scale-100");
            }
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "processing...",
        success: "login successfull 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${authChatModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12  md:w-2/5 h-[12rem] p-6  relative">
        <div className="flex items-center justify-between">
          <h2>Auth</h2>
          <FaTimes className="cursor-pointer" onClick={handleClose} />
        </div>

        <div className="mt-12 flex items-center justify-center space-x-6">
          <button
            className="p-2 bg-blue-400 rounded-md text-white focus:outline-none focus:ring-0"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="p-2 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-0"
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthChat;
