import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <div className="container mx-auto px-4">
        <SearchBar />
      </div>
      <div className="container mx-auto px-4 py-8 flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;