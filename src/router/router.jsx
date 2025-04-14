import { createBrowserRouter } from "react-router-dom";
import ForgetPassword from "../components/auth/ForgetPassword";
import Login from "../components/auth/Login";
import NewPassword from "../components/auth/NewPassword";
import ResetPassword from "../components/auth/ResetPassword";
import SignUp from "../components/auth/SignUp";
import Dashboard from "../components/pages/Dashboard";
import Home from "../components/pages/Home";
import PageNotFound from "../components/pages/PageNotFound";
import Profile from "../components/pages/Profile";
import EditProfile from "../components/Student/EditProfile";
import ExamForm from "../components/Student/ExamForm";
import StudentResult from "../components/Student/StudentResult";
import AllStudent from "../components/Teacher/AllStudent";
import ExamDetail from "../components/Teacher/ExamDetail";
import ExamList from "../components/Teacher/ExamList";
import StudentDetails from "../components/Teacher/StudentDetails";
import TeacherForm from "../components/Teacher/TeacherForm";
import NewForm from "../components/Teacher/NewForm";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Home />
      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "createExam",
          element: (
            // <TeacherForm />
            <NewForm />
          ),
        },
        {
          path: "students",
          element: (
            <AllStudent />
          ),
        },
        {
          path: "student/:id",
          element: <StudentDetails />,
        },
        {
          path: "exams",
          element: (
            <ExamList />
          ),
        },
        {
          path: "exam/:id",
          element: (
            <ExamDetail />
          ),
        },
        {
          path: "updateExam/:id",
          element: (
            <TeacherForm />
          ),
        },
        {
          path: "profile",
          element: <Profile />,
          children: [
            {
              path: "editName",
              element: (
                <EditProfile />
              ),
            },
            {
              path: "resetPassword",
              element: <ResetPassword />,
            },
          ],
        },
        {
          path: "examForm",
          element: (
            <ExamForm />
          ),
        },
        {
          path: "result",
          element: (
            <StudentResult />
          ),
        },
      ],
    },
    {
      path: "/signup",
      element: (
        <SignUp />
      ),
    },
    {
      path: "/login",
      element: (
        <Login />
      ),
    },
    {
      path: "/forgetPassword",
      element: (
        <ForgetPassword />
      ),
    },
    {
      path: "/newPassword",
      element: (
        <NewPassword />
      ),
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
