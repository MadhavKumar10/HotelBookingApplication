const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Find Your Perfect Stay
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover amazing hotels and resorts around the world. Book your dream vacation with unbeatable prices and exclusive deals.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white font-bold text-2xl">5000+</div>
            <div className="text-blue-100">Hotels</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white font-bold text-2xl">100+</div>
            <div className="text-blue-100">Countries</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white font-bold text-2xl">1M+</div>
            <div className="text-blue-100">Happy Guests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;