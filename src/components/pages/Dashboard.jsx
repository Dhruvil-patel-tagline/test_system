/* eslint-disable react-refresh/only-export-components */

import { getCookie } from "../../utils/getCookie";
import AuthRoute from "../auth/AuthRoute";
import StudentDashboard from "../Student/StudentDashboard";
import TeacherDashboard from "../Teacher/TeacherDashboard";

const Dashboard = () => {
  const user = getCookie("authUser");
  return user?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />;
};

export default AuthRoute({ requireAuth: true })(Dashboard);
