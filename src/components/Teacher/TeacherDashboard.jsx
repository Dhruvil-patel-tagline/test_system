/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from "react-router-dom";
import add from "../../assets/add.svg";
import ButtonCom from "../../shared/ButtonCom";
import ExamList from "./ExamList";
import "./css/teacher.css";
import AuthRoute from "../auth/AuthRoute";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "0px 20px" }}>
      <div className="teacherDashboardContainer">
        <ButtonCom onClick={() => navigate("/createExam")}>
          <span className="bntIcon">
            <img src={add} width="30px" height="30px" />
            Create Exam
          </span>
        </ButtonCom>
      </div>
      <ExamList />
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ['teacher'] })(TeacherDashboard);
// export default TeacherDashboard;
