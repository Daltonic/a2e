import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalState, truncate } from "../store";
import { connectWallet } from "../services/blockchain";

const Header = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");

  return (
    <div>
      <header className="flex justify-between items-center h-20 shadow-md p-5 fixed z-auto top-0 right-0 left-0 w-full bg-black text-gray-200 border-t-4 border-orange-500">
        <div className="flex justify-between items-center">
          <Link
            to={"/"}
            className=" text-2xl font-bold hover:text-orange-500 cursor-Linkointer"
          >
            A<b className="text-orange-500 hover:text-white">2</b>E
          </Link>
        </div>
        <div className="sm:flex items-center justify-between px-2 py-1 bg-slate-600 rounded-lg hidden sm:w-3/5 md:w-1/2">
          <input
            className="w-full border-0 outline-0 px-6 relative text-md text-white bg-transparent hover:ouline-none focus:outline-none focus:ring-0"
            type="text"
            id="search-box"
            placeholder="search here..."
            required
          />
          <FaSearch className="absolute hover:text-orange-500 cursor-pointer" />
        </div>

        {connectedAccount ? (
          <button className="bg-orange-500 p-2 rounded-lg text-white cursor-pointer hover:bg-orange-600 hover:text-slate-200 md:text-xs">
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            className="bg-orange-500 p-2 rounded-lg text-white cursor-pointer hover:bg-orange-600 hover:text-slate-200 md:text-xs"
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        )}
      </header>
      <div className="h-20"></div>
    </div>
  );
};

export default Header;
