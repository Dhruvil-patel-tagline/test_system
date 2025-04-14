import { toast } from "react-toastify";
import { studentExamsAction } from "../../../redux/action/studentExamsAction";
import { postRequest } from "../../../utils/api";
import { getCookie } from "../../../utils/getCookie";

const examFormSubmit = async ({ setLoading, navigate, id, dispatch, val }) => {
  const token = getCookie("authToken");

  try {
    if (val) {
      setLoading(true);
    }
    const response = await postRequest(`student/giveExam?id=${id}`, {
      data: JSON.parse(localStorage.getItem("selectedAnswerData")),
      headers: { "access-token": token },
    });
    if (response.statusCode === 200) {
      // toast.success("Exam submitted successfully");
      val && navigate("/dashboard");
      dispatch({ type: "SET_EXAM_PENDING", payload: id });
      setTimeout(() => dispatch(studentExamsAction("submit")), 50000);
    } else {
      toast.error(response?.message);
    }
  } finally {
    setTimeout(() => {
      localStorage.removeItem("selectedAnswerData");
      localStorage.removeItem("timeLeftData");
      localStorage.removeItem("questionData");
    }, 5000);
    setLoading(false);
  }
};

export default examFormSubmit;
