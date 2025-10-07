import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel, isLoading } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-20 text-xl text-gray-600">Hotel not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="flex text-yellow-400">
                {Array.from({ length: hotel.starRating }).map((_, index) => (
                  <AiFillStar key={index} className="text-xl" />
                ))}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {hotel.type}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">{hotel.name}</h1>
            <p className="text-gray-600 mt-2">
              {hotel.city}, {hotel.country}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">${hotel.pricePerNight}</div>
            <div className="text-gray-600">per night</div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image, index) => (
          <div key={index} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={image}
              alt={hotel.name}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotel Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotel.facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <span className="text-gray-700 font-semibold">{facility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Hotel</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {hotel.description}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <GuestInfoForm
              pricePerNight={hotel.pricePerNight}
              hotelId={hotel._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;