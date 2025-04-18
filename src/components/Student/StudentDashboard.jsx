/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentExamsAction } from "../../redux/action/studentExamsAction";
import ButtonCom from "../../shared/ButtonCom";
import Table from "../../shared/Table";
import { getCookie } from "../../utils/getCookie";
import { studentDashboardHeader } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";
import "./css/student.css";

const StudentDashboard = () => {
  const token = getCookie("authToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exams, loading, error, pendingExam } = useSelector(
    (state) => state.examList,
  );

  const tableData = useMemo(() => {
    return exams.map((val, index) => ({
      Index: index + 1,
      Subject: val?.subjectName,
      Email: val?.email,
      Notes: val?.notes.join(", "),
      Action: Object.keys(pendingExam).includes(val?._id) ? (
        <ButtonCom bgColor="yellow" color="black" disabled={true}>
          Pending...
        </ButtonCom>
      ) : val?.Result?.length ? (
        <ButtonCom
          bgColor="rgb(9, 141, 40)"
          color="black"
          onClick={() => navigate("/result", { state: val })}
        >
          View result
        </ButtonCom>
      ) : (
        <ButtonCom
          color="black"
          bgColor="rgb(93, 165, 233)"
          onClick={() =>
            navigate("/examForm", {
              state: {
                id: val?._id,
                subjectName: val?.subjectName,
                notes: val.notes,
              },
            })
          }
        >
          Start Exam
        </ButtonCom>
      ),
    }));
  }, [exams, pendingExam]);

  useEffect(() => {
    if (!exams?.length) dispatch(studentExamsAction());
    localStorage.removeItem("selectedAnswerData");
    localStorage.removeItem("timeLeftData");
    localStorage.removeItem("questionData");
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="studentDashboardContainer">
        Start your Exam & View Results
      </h1>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Table
          tableData={tableData}
          tableHeader={studentDashboardHeader}
          isLoading={loading}
          minWidth={"900px"}
          error={error}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["student"] })(
  StudentDashboard,
);

// export default StudentDashboard;
