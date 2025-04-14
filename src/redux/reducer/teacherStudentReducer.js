const initialState = {
  allStudent: [],
  loading: false,
  error: null,
};

const teacherStudentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TEACHER_STUDENT_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_TEACHER_STUDENT_SUCCESS":
      return { ...state, loading: false, allStudent: action.payload };

    case "FETCH_TEACHER_STUDENT_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default teacherStudentReducer;
