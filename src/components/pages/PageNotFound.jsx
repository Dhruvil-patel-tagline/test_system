import { useNavigate } from "react-router-dom";
import ButtonCom from "../../shared/ButtonCom";
import "./pages.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notFoundContainer">
      <h1 style={{ color: "red" }}>Page not found</h1>
      <br />
      <ButtonCom onClick={() => navigate(-1)}>Back</ButtonCom>
    </div>
  );
};

export default PageNotFound;
