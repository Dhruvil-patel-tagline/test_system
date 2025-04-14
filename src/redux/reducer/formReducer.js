const initialState = {
  formData: {},
  errors: {},
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "RESET_DATA":
      return {
        formData: {},
        errors: {},
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
    default:
      return state;
  }
};

export default formReducer;
