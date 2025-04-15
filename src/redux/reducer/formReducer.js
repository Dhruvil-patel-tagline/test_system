const initialState = {
  formData: {},
  errors: {},
  loading: false,
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "RESET_DATA":
      return {
        formData: {},
        errors: {},
        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
      };
    case "REPLACE_ERROR":
      return {
        ...state,
        errors: action.payload,
      };
    case "SUBMIT_DYNAMIC_FORM":
      return { ...state, loading: true };
    case "SUBMIT_EXAM_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default formReducer;
