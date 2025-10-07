import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData, isLoading } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl font-bold text-gray-300 mb-4">🏨</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Hotels Listed</h2>
        <p className="text-gray-600 mb-6">Start sharing your property with travelers around the world</p>
        <Link
          to="/add-hotel"
          className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Your First Hotel
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Hotels</h1>
          <p className="text-gray-600">Manage your properties and view performance</p>
        </div>
        <Link
          to="/add-hotel"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
        >
          Add Hotel
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {hotelData.map((hotel, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <img
                  src={hotel.imageUrls[0]}
                  className="w-full h-64 lg:h-full object-cover"
                  alt={hotel.name}
                />
              </div>
              
              <div className="lg:col-span-3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {hotel.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-2">{hotel.description}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <BsMap className="text-blue-600" />
                    <span>{hotel.city}, {hotel.country}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <BsBuilding className="text-green-600" />
                    <span>{hotel.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <BiMoney className="text-yellow-600" />
                    <span>${hotel.pricePerNight}/night</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <BiStar className="text-orange-500" />
                    <span>{hotel.starRating} Star</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BiHotel className="text-purple-600" />
                    <span>{hotel.adultCount} adults, {hotel.childCount} children</span>
                  </div>
                  <Link
                    to={`/edit-hotel/${hotel._id}`}
                    className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;