import { Link } from "react-router-dom";

const LatestDestinationCard = ({ hotel }) => {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="h-80 overflow-hidden">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={hotel.name}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-blue-200">{hotel.city}, {hotel.country}</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
            ${hotel.pricePerNight}/night
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
          {hotel.type}
        </span>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;