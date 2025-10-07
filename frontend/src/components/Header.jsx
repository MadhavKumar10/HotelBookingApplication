import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">M</span>
            </div>
            <span className="text-2xl text-white font-bold tracking-tight">
              MernHolidays
            </span>
          </Link>
          
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  className="flex items-center text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold"
                  to="/my-bookings"
                >
                  My Bookings
                </Link>
                <Link
                  className="flex items-center text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold"
                  to="/my-hotels"
                >
                  My Hotels
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;