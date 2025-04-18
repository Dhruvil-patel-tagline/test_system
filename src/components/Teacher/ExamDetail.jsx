/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import edit from "../../assets/edit.svg";
// import { fetchEditExamList } from "../../redux/action/examActions";
import ButtonCom from "../../shared/ButtonCom";
import Table from "../../shared/Table";
// import { getCookie } from "../../utils/getCookie";
import { fetchEditExamList } from "../../redux/action/examActions";
import { getCookie } from "../../utils/getCookie";
import { examDetailHeader } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";
import "./css/teacher.css";

const ExamDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const token = getCookie("authToken");
  const { state } = useLocation();
  const navigate = useNavigate();
  const examListObj = useSelector((state) => state?.editExam);

  const handleEdit = (index) => {
    navigate(`/updateExam/${id}`, {
      state: { subject: state?.subjectName, notes: state?.notes },
    });
    dispatch({
      type: "SET_DATA",
      payload: {
        subjectName: state?.subjectName || "",
        notes: state?.notes || ["", ""],
        examId: id,
        currentQ: index,
        questions: examListObj?.quesArray || [],
      },
    });
  };

  const tableData = useMemo(() => {
    return examListObj?.quesArray?.length
      ? examListObj?.quesArray?.map((q, index) => ({
          Index: index + 1,
          Question: q?.question,
          Answer: q?.answer,
          Action: (
            <ButtonCom onClick={() => handleEdit(index)}>
              <span className="bntIcon">
                <img src={edit} width="18px" height="18px" />
                Edit
              </span>
            </ButtonCom>
          ),
        }))
      : [];
  }, [examListObj]);

  useEffect(() => {
    dispatch(fetchEditExamList(id, token, state?.subjectName, state?.notes));
  }, []);

  return (
    <div className="examDetailRoot">
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <Table
          tableData={tableData}
          tableHeader={examDetailHeader}
          isLoading={examListObj?.loading}
          minWidth={"500px"}
          error={examListObj?.error}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["teacher"] })(
  ExamDetail,
);
