const initialState = {
  exams: [],
  loading: false,
  error: null,
};

const examReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_EXAMS_REQUEST":
    case "DELETE_EXAM_REQUEST":
    case "UPDATE_EXAM_REQUEST":
    case "CREATE_EXAM_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_EXAMS_SUCCESS":
      return { ...state, loading: false, exams: action.payload };
    case "DELETE_EXAM_SUCCESS":
      return {
        ...state,
        loading: false,
        exams: state.exams.filter((exam) => exam._id !== action.payload),
      };
    case "CREATE_EXAM_SUCCESS":
      return {
        ...state,
        loading: false,
        exams: [...state.exams, action.payload],
      };
    case "UPDATE_EXAM_SUCCESS":
      return {
        ...state,
        loading: false,
        exams: state.exams.map((exam) =>
          exam._id === action.payload._id ? action.payload : exam,
        ),
      };
    case "UPDATE_EXAMS_FAILURE":
    case "FETCH_EXAMS_FAILURE":
    case "DELETE_EXAM_FAILURE":
    case "UPDATE_EXAM_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default examReducer;
