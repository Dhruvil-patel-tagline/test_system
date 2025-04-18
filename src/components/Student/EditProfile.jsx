/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editProfileAction } from "../../redux/action/editProfileAction";
import DynamicForm from "../../shared/DynamicForm";
import Loader from "../../shared/Loader";
import { getCookie } from "../../utils/getCookie";
import { editProfileField } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";
import "./css/student.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = getCookie("authUser");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.formData.loading);

  const handleRename = (formData, resetFormData) => {
    dispatch(editProfileAction({ formData, resetFormData, user, navigate }));
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
