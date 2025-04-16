/* eslint-disable react-refresh/only-export-components */
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DynamicForm from "../../shared/DynamicForm";
import Loader from "../../shared/Loader";
import AuthRoute from "../auth/AuthRoute";
import TeacherFormValidate from "./components/TeacherFormValidate";
import "./css/teacher.css";

const CreateUpdateExamForm = () => {
  const loading = useSelector((state) => state.exams.loading);
  const { pathname } = useLocation();
  const isUpdateForm = pathname.includes("updateExam");
  const { customValidation, handleSubmit, resetForm, examData, formFields } =
    TeacherFormValidate({ isUpdateForm });

  return (
    <div>
      <div style={{ paddingTop: "20px" }}>
        {loading && <Loader />}
        <h1 className="teacherFormHeading">
          {isUpdateForm ? "Edit Exam" : "Create Exam"}
        </h1>
        <div className="teacherFormInner">
          <DynamicForm
            fields={formFields}
            initialValues={examData}
            onSubmit={handleSubmit}
            buttonText={isUpdateForm ? "Update" : "Submit"}
            resetButton={resetForm}
            customValidation={customValidation}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["teacher"] })(
  CreateUpdateExamForm,
);
