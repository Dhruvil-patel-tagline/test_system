import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import "./pages.css";

const Home = () => {
  const { pathname } = useLocation();
  if (pathname === "/") {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="homeContainer">
      <Navbar />
      <div className="homeInner">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
