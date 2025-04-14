/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormCom from "../../shared/FormCom";
import Loader from "../../shared/Loader";
import { getRequest, postRequest } from "../../utils/api";
import { newPasswordFields, newPasswordInitial } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  let token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response = await getRequest("users/newPassword", token);
        if (response.statusCode !== 200) {
          toast.error("Password reset link is expired");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const onSubmit = async (formData) => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = {
      Password: password,
      ConfirmPassword: confirmPassword,
    };

    try {
      setLoading(true);
      const response = await postRequest(
        `users/ForgotPassword/Verify?token=${token}`,
        { data: user },
      );
      if (response?.statusCode === 200) {
        toast.success("Password updated successfully");
        setTimeout(() => {
          window.open("/login", "_blank");
          window.close();
        }, 3000);
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
        <h1 className="authHeading">Reset password</h1>
        <FormCom
          fields={newPasswordFields}
          initialValues={newPasswordInitial}
          onSubmit={onSubmit}
          buttonText="Submit"
        />
      </div>
    </div>
  );
};
export default AuthRoute({ redirectIfAuth: true })(NewPassword);
