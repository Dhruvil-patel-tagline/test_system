/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormCom from "../../shared/FormCom";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { fields, signUpUserObj } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addUser = async (userData, resetFormData) => {
    try {
      setLoading(true);
      let response = await postRequest("users/SignUp", { data: userData });
      if (response.statusCode === 200) {
        toast.success("Please verify your email");
        resetFormData();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      {loading && <Loader />}
      <div className="authInnerDiv">
        <h1 className="authHeading">SignUp </h1>
        <FormCom
          fields={fields}
          initialValues={signUpUserObj}
          onSubmit={addUser}
          buttonText="Sign Up"
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <p>Already have an account?</p>
          <Link
            to="/login"
            style={{ textDecoration: "underline" }}
            state={{ padding: "0px" }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRoute({ redirectIfAuth: true })(SignUp);
