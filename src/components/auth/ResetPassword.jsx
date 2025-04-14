/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cancel from "../../assets/cancel.png";
import FormCom from "../../shared/FormCom";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { ResetPasswordFields, resetPasswordObj } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";

const ResetPassword = () => {
  const token = getCookie("authToken");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const onSubmit = async (data) => {
    const { oldPassword, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

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
      } else {
        toast.error(response?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormKey((prev) => prev + 1);
  };
  return (
    <div className="resetPasswordContainer">
      {loading && <Loader />}
      <div className="resetPasswordInner">
        <h1 className="resetPassHeading">Reset password</h1>
        <br />
        <FormCom
          key={formKey}
          fields={ResetPasswordFields}
          initialValues={resetPasswordObj}
          onSubmit={onSubmit}
          buttonText="Submit"
          secondaryButton={{
            text: (
              <span className="btnIcon">
                <img src={cancel} height="15px" width="15px" alt="cancel" />
                Cancel
              </span>
            ),
            onClick: handleCancel,
            color: "default",
          }}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true })(ResetPassword);
