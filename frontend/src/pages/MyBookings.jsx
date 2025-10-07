import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: hotels, isLoading, error } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  // Function to remove duplicate bookings
  const removeDuplicateBookings = (hotels) => {
    if (!hotels) return [];
    
    return hotels.map(hotel => {
      if (!hotel.bookings || !Array.isArray(hotel.bookings)) return hotel;
      
      // Remove duplicate bookings based on checkIn date and guest counts
      const uniqueBookings = hotel.bookings.filter((booking, index, self) => 
        index === self.findIndex(b => 
          b.checkIn === booking.checkIn && 
          b.checkOut === booking.checkOut &&
          b.adultCount === booking.adultCount &&
          b.childCount === booking.childCount
        )
      );
      
      return {
        ...hotel,
        bookings: uniqueBookings
      };
    });
  };

  const uniqueHotels = removeDuplicateBookings(hotels);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

 if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-xl font-semibold mb-4">
          Error loading bookings
        </div>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!uniqueHotels || uniqueHotels.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl font-bold text-gray-300 mb-4">📅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
        <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Explore Hotels
        </button>
      </div>
    );
  }

  return (
     <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your upcoming stays and past reservations</p>
      </div>

      <div className="space-y-6">
      {uniqueHotels.map((hotel) => (
        <div 
            key={hotel._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-1">
            <img
              src={hotel.imageUrls?.[0] || "/placeholder-hotel.jpg"}
              className="w-full h-full object-cover object-center"
              alt={hotel.name}
            />
          </div>
          
          <div className="lg:col-span-2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{hotel.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {hotel.city}, {hotel.country}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {hotel.type}
                  </span>
                </div>
            
            <div className="space-y-4">
                  {hotel.bookings?.map((booking, index) => (
                    <div 
                      key={index}
                      className="border-l-4 border-blue-500 bg-blue-50/50 rounded-r-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Dates: </span>
                          <span className="text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Guests: </span>
                          <span className="text-gray-600">
                            {booking.adultCount} adults, {booking.childCount} children
                          </span>
                        </div>
                        {booking.totalCost && (
                          <div>
                            <span className="font-semibold text-gray-700">Total Cost: </span>
                            <span className="text-green-600 font-semibold">${booking.totalCost}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-gray-700">Status: </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;