/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DynamicForm from "../../shared/DynamicForm";
import Loader from "../../shared/Loader";
import { putRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { editProfileField } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";
import "./css/student.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = getCookie("authUser");
  const token = getCookie("authToken");
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.formData.loading);

  const handleRename = async (formData, resetFormData) => {
    try {
      // setLoading(true);
      dispatch({ type: "SUBMIT_DYNAMIC_FORM" });
      const response = await putRequest("student/studentProfile", formData, {
        "access-token": token,
      });
      if (response.statusCode === 200) {
        toast.success("Name updated Successfully");
        navigate("/profile");
        document.cookie = `authUser=${JSON.stringify({ ...user, name: formData.name })};path=/; max-age=${60 * 60}; secure`;
        resetFormData();
      } else {
        toast.error(response?.message || "Error occurred");
      }
    } finally {
      // setLoading(false);
      dispatch({ type: "SUBMIT_EXAM_LOADING" });
    }
  };

  return (
    <div className="editProfileContainer">
      {loading && <Loader />}
      <h1 className="heading">Edit Name</h1>
      <div className="editProfileHeading">
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>
      <hr className="horizontalRule" style={{ marginBottom: "10px" }} />
      <DynamicForm
        fields={editProfileField}
        initialValues={{ name: user?.name }}
        onSubmit={handleRename}
      />
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["student"] })(
  EditProfile,
);
