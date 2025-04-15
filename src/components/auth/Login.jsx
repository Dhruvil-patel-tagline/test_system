/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DynamicForm from "../../shared/DynamicForm";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { loginFields, userObj } from "../../utils/staticObj";
import AuthRoute from "./AuthRoute";
import "./css/auth.css";

const Login = () => {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.formData.loading);

  const onSubmit = async (formData, resetFormData) => {
    try {
      // setLoading(true);
      dispatch({ type: "SUBMIT_DYNAMIC_FORM" });
      const response = await postRequest("users/Login", { data: formData });
      if (response.statusCode === 200) {
        document.cookie = `authToken=${response?.data?.token}; path=/; max-age=${60 * 60}; secure`;
        document.cookie = `authUser=${JSON.stringify(response?.data)}; path=/; max-age=${60 * 60}; secure`;
        navigate("/dashboard");
        resetFormData();
      }
    } finally {
      // setLoading(false);
      dispatch({ type: "SUBMIT_EXAM_LOADING" });
    }
  };

  return (
    <div className="authContainer">
      {loading && <Loader />}
      <div className="authInnerDiv">
        <h1 className="authHeading">Login </h1>
        <DynamicForm
          fields={loginFields}
          initialValues={userObj}
          onSubmit={onSubmit}
          buttonText="Login"
        />
        <p>
          <Link to="/forgetPassword" style={{ textDecoration: "underline" }}>
            Forget password
          </Link>
        </p>
        <br />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <p>Don't have an account?</p>
          <Link to="/signup" style={{ textDecoration: "underline" }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRoute({ redirectIfAuth: true })(Login);
