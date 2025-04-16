/* eslint-disable react-refresh/only-export-components */
import { getCookie } from "../src/utils/getCookie";
import StudentDashboard from "../src/components/Student/StudentDashboard";
import TeacherDashboard from "../src/components/Teacher/TeacherDashboard";
import AuthRoute from "../src/components/auth/AuthRoute";

const Dashboard = () => {
  const user = getCookie("authUser");

  user?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />;
};

export default AuthRoute({ requireAuth: true })(Dashboard);
