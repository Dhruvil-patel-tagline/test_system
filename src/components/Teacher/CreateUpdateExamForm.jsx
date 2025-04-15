import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Loader from "../../shared/Loader";
import TeacherFormValidate from "./components/TeacherFormValidate";
import "./css/teacher.css";
import DynamicForm from "../../shared/DynamicForm";

const CreateUpdateExamForm = () => {
  const exams = useSelector((state) => state.exams);
  const { state, pathname } = useLocation();
  const isUpdateForm = pathname.includes("updateExam");
  const { customValidation, handleSubmit, resetForm, examData, formFields } =
    TeacherFormValidate({ isUpdateForm, state });

  return (
    <div>
      <div style={{ paddingTop: "20px" }}>
        {exams?.loading && <Loader />}
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

export default CreateUpdateExamForm;
