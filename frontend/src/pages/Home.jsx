import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard.jsx";

const Home = () => {
  const { data: hotels, isLoading, error } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /* console.log("API Response:", hotels); // Add this to see what's returned
  console.log("Hotels data:", hotels); */

  // Check what the actual data structure is
  /* if (hotels) {
    console.log("Hotels data type:", typeof hotels);
    console.log("Is array?", Array.isArray(hotels));
    console.log("Hotels keys:", Object.keys(hotels || {}));
  } */



  // Handle different data structures
  let hotelList = [];
  
  if (hotels) {
    if (Array.isArray(hotels)) {
      hotelList = hotels;
    } else if (hotels.data && Array.isArray(hotels.data)) {
      hotelList = hotels.data; // If API returns { data: [...] }
    } else if (hotels.hotels && Array.isArray(hotels.hotels)) {
      hotelList = hotels.hotels; // If API returns { hotels: [...] }
    }
  }

  const topRowHotels = hotelList.slice(0, 2);
  const bottomRowHotels = hotelList.slice(2, 5);

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading hotels: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Latest Destinations
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Most recent destinations added by our hosts. Find your perfect stay from our carefully curated collection.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {topRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
        
        {bottomRowHotels.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                More Amazing Stays
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bottomRowHotels.map((hotel) => (
                <LatestDestinationCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;