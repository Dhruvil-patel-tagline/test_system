/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { ResetPasswordFields, resetPasswordObj } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";
import DynamicForm from "../../shared/DynamicForm";

const ResetPassword = () => {
  const token = getCookie("authToken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data, resetFormData) => {
    const { oldPassword, password, confirmPassword } = data

    try {
      setLoading(true);
      const response = await postRequest("users/ResetPassword", {
        data: {
          oldPassword,
          Password: password,
          ConfirmPassword: confirmPassword,
        },
        headers: {
          "access-token": token,
        },
      });
      if (response.statusCode === 200) {
        navigate("/profile");
        resetFormData();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resetPasswordContainer">
      {loading && <Loader />}
      <div className="resetPasswordInner">
        <h1 className="resetPassHeading">Reset password</h1>
        <br />
        <DynamicForm
          fields={ResetPasswordFields}
          initialValues={resetPasswordObj}
          onSubmit={onSubmit}
          buttonText="Submit"
          resetButton={true}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true })(ResetPassword);
