import { createBrowserRouter } from "react-router-dom";
import ForgetPassword from "../components/auth/ForgetPassword";
import Login from "../components/auth/Login";
import NewPassword from "../components/auth/NewPassword";
import ResetPassword from "../components/auth/ResetPassword";
import SignUp from "../components/auth/SignUp";
import Home from "../components/pages/Home";
import PageNotFound from "../components/pages/PageNotFound";
import EditProfile from "../components/Student/EditProfile";
import ExamForm from "../components/Student/ExamForm";
import StudentDashboard from "../components/Student/StudentDashboard";
import StudentProfile from "../components/Student/StudentProfile";
import StudentResult from "../components/Student/StudentResult";
import AllStudent from "../components/Teacher/AllStudent";
import CreateUpdateExamForm from "../components/Teacher/CreateUpdateExamForm";
import ExamDetail from "../components/Teacher/ExamDetail";
import ExamList from "../components/Teacher/ExamList";
import StudentDetails from "../components/Teacher/StudentDetails";
import TeacherDashboard from "../components/Teacher/TeacherDashboard";
import { getCookie } from "../utils/getCookie";
const user = getCookie("authUser");

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "dashboard",
          element:
            user?.role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <StudentDashboard />
            ),
        },
        {
          path: "createExam",
          element: <CreateUpdateExamForm />,
        },
        {
          path: "students",
          element: <AllStudent />,
        },
        {
          path: "student/:id",
          element: <StudentDetails />,
        },
        {
          path: "exams",
          element: <ExamList />,
        },
        {
          path: "exam/:id",
          element: <ExamDetail />,
        },
        {
          path: "updateExam/:id",
          element: <CreateUpdateExamForm />,
        },
        {
          path: "profile",
          element:
            user?.role === "student" ? <StudentProfile /> : <ResetPassword />,
          children: [
            {
              path: "editName",
              element: <EditProfile />,
            },
            {
              path: "resetPassword",
              element: <ResetPassword />,
            },
          ],
        },
        {
          path: "examForm",
          element: <ExamForm />,
        },
        {
          path: "result",
          element: <StudentResult />,
        },
      ],
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgetPassword",
      element: <ForgetPassword />,
    },
    {
      path: "/newPassword",
      element: <NewPassword />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export default router;
