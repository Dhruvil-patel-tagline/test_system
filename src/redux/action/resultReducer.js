import { getRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";

export const studentExamsAction = () => {
    return async (dispatch) => {
        try {
            const token = getCookie("authToken");
            const response = await getRequest("student/studentExam", token);
            if (response.statusCode === 200) {
                dispatch({ type: 'FETCH_EXAMS_SUCCESS', payload: response.data });
            } else {
                dispatch({ type: 'FETCH_EXAMS_FAILURE', payload: response?.message || "Error occurred" });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_EXAMS_FAILURE', payload: error?.message || "Error occurred" });
        }
    };
};
