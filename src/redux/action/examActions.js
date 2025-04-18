import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../utils/api";
import { resetForm } from "./resetForm";

export const fetchExams = (token) => async (dispatch) => {
  dispatch({ type: "FETCH_EXAMS_REQUEST" });
  try {
    const response = await getRequest("dashboard/Teachers/viewExam", token);
    if (response?.statusCode === 200) {
      dispatch({ type: "FETCH_EXAMS_SUCCESS", payload: response.data });
    } else {
      dispatch({
        type: "FETCH_EXAMS_FAILURE",
        payload: response?.message || "Error occurred",
      });
    }
  } catch (error) {
    dispatch({
      type: "FETCH_EXAMS_FAILURE",
      payload: error.message || "Error occurred",
    })
  }
};

export const deleteExam = (id, token) => async (dispatch) => {
  dispatch({ type: "DELETE_EXAM_REQUEST" });
  try {
    const response = await deleteRequest(
      `dashboard/Teachers/deleteExam?id=${id}`,
      token,
    );
    if (response?.statusCode === 200) {
      dispatch({ type: "DELETE_EXAM_SUCCESS", payload: id });
      toast.success(response?.message);
    } else {
      dispatch({ type: "DELETE_EXAM_FAILURE", payload: response?.message });
      toast.error(response?.message || "Error occurred");
    }
  } catch (error) {
    dispatch({
      type: "DELETE_EXAM_FAILURE",
      payload: error.message || "Error occurred",
    });
  }
};

export const createExam = (examData, token, navigate) => async (dispatch) => {
  dispatch({ type: "CREATE_EXAM_REQUEST" });
  try {
    const response = await postRequest("dashboard/Teachers/Exam", {
      data: examData,
      headers: {
        "access-token": token,
      },
    });
    if (response?.statusCode === 200) {
      dispatch({ type: "CREATE_EXAM_SUCCESS", payload: response.data });
      dispatch(resetForm());
      navigate("/dashboard");
    } else {
      dispatch({ type: "CREATE_EXAM_FAILURE", payload: response.message });
      toast.error(response.message || "Error occurred");
    }
  } catch (error) {
    dispatch({ type: "CREATE_EXAM_FAILURE", payload: error.message });
  }
};

export const updateExam =
  (examData, id, token, navigate) => async (dispatch) => {
    dispatch({ type: "UPDATE_EXAM_REQUEST" });
    try {
      const response = await putRequest(
        `dashboard/Teachers/editExam?id=${id}`,
        examData,
        { "access-token": token },
      );
      if (response?.statusCode === 200) {
        dispatch({ type: "UPDATE_EXAM_SUCCESS", payload: response.data });
        dispatch({
          type: "FETCH_EDIT_EXAMS_SUCCESS",
          payload: {
            quesArray: examData.questions,
            subjectName: examData.subjectName,
            notes: examData.notes,
          },
        });
        toast.success(response?.message);
        dispatch(resetForm());
        navigate(`/exam/${id}`, {
          state: { subjectName: examData?.subjectName, notes: examData?.notes },
        });
      } else {
        dispatch({ type: "UPDATE_EXAM_FAILURE", payload: response.message });
        toast.error(response?.message);
      }
    } catch (error) {
      dispatch({ type: "UPDATE_EXAM_FAILURE", payload: error.message });
    }
  };

export const fetchEditExamList =
  (id, token, subject, notes, setFormData) => async (dispatch) => {
    dispatch({ type: "FETCH_EDIT_EXAMS_REQUEST" });
    try {
      const response = await getRequest(
        `dashboard/Teachers/examDetail?id=${id}`,
        token,
      );
      if (response?.statusCode === 200) {
        dispatch({
          type: "FETCH_EDIT_EXAMS_SUCCESS",
          payload: { quesArray: response?.data?.questions, subject, notes },
        });
        if (setFormData) {
          dispatch({
            type: "SET_DATA",
            payload: {
              subjectName: subject,
              notes: notes,
              examId: id,
              currentQ: 0,
              questions: response?.data?.questions || [],
            },
          });
        }
      } else {
        dispatch({
          type: "FETCH_EDIT_EXAMS_FAILURE",
          payload: response?.message,
        });
      }
    } catch (error) {
      dispatch({ type: "FETCH_EDIT_EXAMS_FAILURE", payload: error.message });
    }
  };
