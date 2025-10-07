import { useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore, MdPerson, MdChildCare } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState(search.destination);
  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [adultCount, setAdultCount] = useState(search.adultCount);
  const [childCount, setChildCount] = useState(search.childCount);

  const handleSubmit = (event) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto px-4 -mt-8"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Destination
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <MdTravelExplore className="text-gray-400 text-xl mr-3" />
            <input
              placeholder="Where are you going?"
              className="w-full focus:outline-none text-lg"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Check-in
          </label>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Check-out
          </label>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-out Date"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              <MdPerson className="inline mr-1" />
              Adults
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              min={1}
              max={20}
              value={adultCount}
              onChange={(event) => setAdultCount(parseInt(event.target.value))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              <MdChildCare className="inline mr-1" />
              Children
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              min={0}
              max={20}
              value={childCount}
              onChange={(event) => setChildCount(parseInt(event.target.value))}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Search
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            onClick={() => {
              setDestination("");
              setCheckIn(new Date());
              setCheckOut(new Date());
              setAdultCount(1);
              setChildCount(0);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;