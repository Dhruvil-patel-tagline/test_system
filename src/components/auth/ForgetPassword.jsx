/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonCom from "../../shared/ButtonCom";
import DynamicForm from "../../shared/DynamicForm";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { forgotFields } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.formData.loading);

  const handleSubmit = async (formData, resetFormData) => {
    try {
      dispatch({ type: "SUBMIT_DYNAMIC_FORM" });
      let response = await postRequest("users/ForgotPassword", {
        data: formData,
        errorMessage: "User not fond",
      });
      if (response.statusCode === 200) {
        navigate("/login");
        resetFormData();
      }
    } finally {
      dispatch({ type: "SUBMIT_EXAM_LOADING" });
    }
  };

  return (
    <div className="authContainer">
      {loading && <Loader />}
      <div className="authInnerDiv">
        <h1 className="authHeading">Forget Password</h1> <br />
        <DynamicForm
          fields={forgotFields}
          initialValues={{ email: "" }}
          onSubmit={handleSubmit}
          buttonText="Submit"
        />
        <div className="forgotInner" style={{ marginTop: "10px" }}>
          <ButtonCom type="button" onClick={() => navigate(-1)}>
            Back
          </ButtonCom>
        </div>
      </div>
    </div>
  );
};

export default AuthRoute({ redirectIfAuth: true })(ForgetPassword);
