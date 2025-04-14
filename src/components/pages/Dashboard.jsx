import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/getCookie";
import StudentDashboard from "../Student/StudentDashboard";
import TeacherDashboard from "../Teacher/TeacherDashboard";
import AuthRoute from "../auth/AuthRoute";

const Dashboard = () => {
  const user = getCookie("authUser");
  const token = getCookie("authToken");
  if (!user || !token) {
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "authUser=; path=/; max-age=0";
    <Navigate to="/login" />;
  }
  if (user?.role === "teacher") {
    return <TeacherDashboard />;
  } else if (user?.role === "student") {
    return <StudentDashboard />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Dashboard;
