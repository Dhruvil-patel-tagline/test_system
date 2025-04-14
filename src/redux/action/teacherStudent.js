import { getRequest } from "../../utils/api";

export const allStudentList = (apiEndpoint, token) => async (dispatch) => {
  dispatch({ type: "FETCH_TEACHER_STUDENT_REQUEST" });
  try {
    const response = await getRequest(apiEndpoint, token);
    if (response?.statusCode === 200) {
      dispatch({
        type: "FETCH_TEACHER_STUDENT_SUCCESS",
        payload: response?.data,
      });
    } else {
      dispatch({
        type: "FETCH_TEACHER_STUDENT_FAILURE",
        payload: response?.message || "Error occurred",
      });
    }
  } catch (error) {
    dispatch({
      type: "FETCH_TEACHER_STUDENT_FAILURE",
      payload: error.message || "Error occurred",
    });
  }
};
