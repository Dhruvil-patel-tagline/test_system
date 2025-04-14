/* eslint-disable react-refresh/only-export-components */
import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { fields, signUpUserObj } from "../../utils/staticObj";
import "./css/auth.css";
import AuthRoute from "./AuthRoute";
import FormCom from "../../shared/FormCom";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addUser = async (userData, resetForm) => {
    try {
      setLoading(true);
      let response = await postRequest("users/SignUp", { data: userData });
      if (response.statusCode === 200) {
        toast.success("Please verify your email");
        resetForm(signUpUserObj);
        navigate("/login");
      } else {
        toast.error(response?.message);
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
