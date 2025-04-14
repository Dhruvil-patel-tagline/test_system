/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonCom from "../../shared/ButtonCom";
import InputCom from "../../shared/InputCom";
import Loader from "../../shared/Loader";
import { putRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import validate from "../../utils/validate";
import "./css/student.css";
import AuthRoute from "../auth/AuthRoute";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = getCookie("authUser");
  const token = getCookie("authToken");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    name: user?.name || "Unknown",
    email: user?.email || "data not found",
  });
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
    if (error) {
      setError(validate(e.target.name, e.target.value));
      if (e.target.value.trim() === data?.name.trim()) {
        setError("Updated name is same as actual name");
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let value = validate("name", name);
    if (value) {
      setError(value);
      return;
    }
    try {
      setLoading(true);
      const response = await putRequest(
        "student/studentProfile",
        { name },
        { "access-token": token },
      );
      if (response.statusCode === 200) {
        toast.success("Name updated Successfully");
        navigate("/profile");
        setData({ ...data, name: name });
        document.cookie = `authUser=${JSON.stringify({ ...user, name: name })};path=/; max-age=${60 * 60}; secure`;
      } else {
        toast.error(response?.message || "Error occurred");
      }
    } finally {
      setLoading(false);
      setName("");
    }
  };

  return (
    <div className="editProfileContainer">
      {loading && <Loader />}
      <h1 className="heading">Edit Name</h1>
      <div className="editProfileHeading">
        <p>Name: {data?.name}</p>
        <p>Email: {data?.email}</p>
      </div>
      <hr className="horizontalRule" />
      <form style={{ marginTop: "10px" }}>
        {error && <span className="error">{error}</span>}
        <InputCom
          type="name"
          name="name"
          id="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter your name..."
        />
        <ButtonCom onClick={handleSubmit} color="green">
          Submit
        </ButtonCom>
      </form>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ['student'] })(EditProfile);
