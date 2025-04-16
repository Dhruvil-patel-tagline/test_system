/* eslint-disable react-refresh/only-export-components */
import { getCookie } from "../src/utils/getCookie";
import AuthRoute from "../src/components/auth/AuthRoute";
import ResetPassword from "../src/components/auth/ResetPassword";
import StudentProfile from "../src/components/Student/StudentProfile";

const Profile = () => {
  const user = getCookie("authUser");

  return user?.role === "student" ? <StudentProfile /> : <ResetPassword />;
};

export default AuthRoute({ requireAuth: true })(Profile);
