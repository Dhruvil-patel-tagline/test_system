/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/delete.png";
import vision from "../../assets/vision.png";
import { deleteExam, fetchExams } from "../../redux/action/examActions";
import ButtonCom from "../../shared/ButtonCom";
import Table from "../../shared/Table";
import { getCookie } from "../../utils/getCookie";
import { examListHeader } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";
import "./css/teacher.css";

const ExamList = () => {
  const token = getCookie("authToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const examsList = useSelector((state) => state.exams);
  console.log(examsList);
  const handleExaView = (exam) => {
    navigate(`/exam/${exam._id}`, {
      state: { subject: exam.subjectName, notes: exam.notes },
    });
  };

  const handleExaDelete = (id) => {
    let confirmDelete = confirm("Are you sure you want to delete this exam?");
    confirmDelete && dispatch(deleteExam(id, token));
  };

  const tableData = useMemo(() => {
    return examsList?.exams?.length
      ? examsList?.exams?.map((val) => ({
          Subject: val.subjectName,
          Email: val.email,
          Notes: val.notes.join(", "),
          "View Exam": (
            <ButtonCom onClick={() => handleExaView(val)} color="skyblue">
              <span className="bntIcon">
                <img src={vision} width="20px" height="20px" />
                View Exam
              </span>
            </ButtonCom>
          ),
          "Delete Exam": (
            <ButtonCom onClick={() => handleExaDelete(val._id)} color="red">
              <span className="bntIcon">
                <img src={deleteIcon} width="15px" height="15px" />
                Delete Exam
              </span>
            </ButtonCom>
          ),
        }))
      : [];
  }, [examsList]);

  useEffect(() => {
    if (!examsList.exams.length) dispatch(fetchExams(token));
  }, [token]);

  return (
    <div>
      <div style={{ maxWidth: "1100px", margin: "0px auto" }}>
        <Table
          tableHeader={examListHeader}
          tableData={tableData}
          isLoading={examsList.loading}
          error={examsList.error}
          minWidth={"1000px"}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["teacher"] })(
  ExamList,
);
