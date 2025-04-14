const initialState = {
  exams: [],
  loading: false,
  error: null,
  pendingExam: {},
};

const studentExamReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_EXAMS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_EXAMS_SUCCESS":
      return { ...state, loading: false, exams: action.payload };
    case "SET_EXAM_PENDING":
      return {
        ...state,
        pendingExam: { ...state.pendingExam, [action.payload]: true },
      };
    case "REMOVE_EXAM_PENDING":
      var pendingExamsObj = { ...state.pendingExam };
      action.payload.forEach((val) => {
        if (val.Result.length > 0) {
          delete pendingExamsObj[val._id];
        }
      });
      return { ...state, exams: action.payload, pendingExam: pendingExamsObj };
    case "FETCH_EXAMS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default studentExamReducer;
