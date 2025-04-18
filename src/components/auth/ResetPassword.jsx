/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DynamicForm from "../../shared/DynamicForm";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { ResetPasswordFields, resetPasswordObj } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";

const ResetPassword = () => {
  const token = getCookie("authToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.formData.loading);

  const onSubmit = async (data, resetFormData) => {
    const { oldPassword, password, confirmPassword } = data;
    if (oldPassword === password) {
      toast.error("Old password and new password should be different");
      return;
    }
    try {
      dispatch({ type: "SUBMIT_DYNAMIC_FORM" });
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
      dispatch({ type: "SUBMIT_EXAM_LOADING" });
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
