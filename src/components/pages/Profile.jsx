/* eslint-disable react-refresh/only-export-components */
import { getCookie } from "../../utils/getCookie";
import AuthRoute from "../auth/AuthRoute";
import ResetPassword from "../auth/ResetPassword";
import StudentProfile from "../Student/StudentProfile";

const Profile = () => {
  const user = getCookie("authUser");
  return user?.role === "student" ? <StudentProfile /> : <ResetPassword />;
};

export default AuthRoute({ requireAuth: true })(Profile);
