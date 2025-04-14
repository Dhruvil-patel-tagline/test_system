import { combineReducers } from "redux";
import editExamReducer from "./editExamReducer";
import examReducer from "./examReducer";
import teacherStudentReducer from "./teacherStudentReducer";
import studentExamReducer from "./studentExamReducer";

const rootReducer = combineReducers({
  exams: examReducer,
  editExam: editExamReducer,
  teacherStudent: teacherStudentReducer,
  examList: studentExamReducer,
});

export default rootReducer;
