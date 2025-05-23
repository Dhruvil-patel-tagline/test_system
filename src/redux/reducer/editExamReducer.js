const initialState = {
  quesArray: [],
  subject: "",
  notes: "",
  loading: false,
  error: null,
};

const editExamReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_EDIT_EXAMS_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_EDIT_EXAMS_SUCCESS":
      return {
        ...state,
        loading: false,
        quesArray: action.payload.quesArray,
        subject: action.payload.subject,
        notes: action.payload.notes,
      };

    case "FETCH_EDIT_EXAMS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state || null;
  }
};

export default editExamReducer;
