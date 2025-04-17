import { combineReducers } from "redux";
import editExamReducer from "./editExamReducer";
import examReducer from "./examReducer";
import formReducer from "./formReducer";
import studentExamReducer from "./studentExamReducer";
import teacherStudentReducer from "./teacherStudentReducer";

const rootReducer = combineReducers({
  exams: examReducer,
  editExam: editExamReducer ,
  teacherStudent: teacherStudentReducer,
  examList: studentExamReducer,
  formData: formReducer,
});

export default rootReducer;
