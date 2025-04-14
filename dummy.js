import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../components/auth/AuthGuard";
import AuthStudent from "../components/auth/AuthStudent";
import AuthTeacher from "../components/auth/AuthTeacher";
import ForgetPassword from "../components/auth/ForgetPassword";
import Login from "../components/auth/Login";
import NewPassword from "../components/auth/NewPassword";
import Protected from "../components/auth/Protected";
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

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (
                <Protected>
                    <Home />
                </Protected>
            ),
            children: [
                {
                    path: "dashboard",
                    element: <Dashboard />,
                },
                {
                    path: "createExam",
                    element: (
                        <AuthTeacher>
                            <TeacherForm />
                        </AuthTeacher>
                    ),
                },
                {
                    path: "students",
                    element: (
                        <AuthTeacher>
                            <AllStudent />
                        </AuthTeacher>
                    ),
                },
                {
                    path: "student/:id",
                    element: <StudentDetails />,
                },
                {
                    path: "exams",
                    element: (
                        <AuthTeacher>
                            <ExamList />
                        </AuthTeacher>
                    ),
                },
                {
                    path: "exam/:id",
                    element: (
                        <AuthTeacher>
                            <ExamDetail />
                        </AuthTeacher>
                    ),
                },
                {
                    path: "updateExam/:id",
                    element: (
                        <AuthTeacher>
                            <TeacherForm />
                        </AuthTeacher>
                    ),
                },
                {
                    path: "profile",
                    element: <Profile />,
                    children: [
                        {
                            path: "editName",
                            element: (
                                <AuthStudent>
                                    <EditProfile />
                                </AuthStudent>
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
                        <AuthStudent>
                            <ExamForm />
                        </AuthStudent>
                    ),
                },
                {
                    path: "result",
                    element: (
                        <AuthStudent>
                            <StudentResult />
                        </AuthStudent>
                    ),
                },
            ],
        },
        {
            path: "/signup",
            element: (
                <AuthGuard>
                    <SignUp />
                </AuthGuard>
            ),
        },
        {
            path: "/login",
            element: (
                <AuthGuard>
                    <Login />
                </AuthGuard>
            ),
        },
        {
            path: "/forgetPassword",
            element: (
                <AuthGuard>
                    <ForgetPassword />
                </AuthGuard>
            ),
        },
        {
            path: "/newPassword",
            element: (
                <AuthGuard>
                    <NewPassword />
                </AuthGuard>
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
