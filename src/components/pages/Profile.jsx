import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/getCookie";
import ResetPassword from "../auth/ResetPassword";
import StudentProfile from "../Student/StudentProfile";
import AuthRoute from "../auth/AuthRoute";

const Profile = () => {
  const user = getCookie("authUser");
  if (!user.role) {
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "authUser=; path=/; max-age=0";
    <Navigate to="/login" />;
  }
  return user?.role === "teacher" ? <ResetPassword /> : <StudentProfile />;
};

export default Profile;
