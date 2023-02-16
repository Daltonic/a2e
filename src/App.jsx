import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./views/Home";
import Question from "./views/Question";
import AddQuestion from "./components/AddQuestion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setGlobalState, useGlobalState } from "./store";
import { WalletConnectedStatus } from "./services/blockchain";
import {checkAuthState} from './services/Chat'
import { useEffect, useState } from "react";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [connectedAccount] = useGlobalState("connectedAccount");

  useEffect(async () => {
    await WalletConnectedStatus().then(async () => {
      console.log("Blockchain Loaded");
      await checkAuthState().then((user)=>{
        setGlobalState('currentUser',user)
      })
      setLoaded(true);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {loaded ? (
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/question/:id"} element={<Question />} />
        </Routes>
      ) : null}

      {connectedAccount ? <AddQuestion /> : null}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
