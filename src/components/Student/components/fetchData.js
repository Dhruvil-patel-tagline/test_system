import { getRequest } from "../../../utils/api";
import { getCookie } from "../../../utils/getCookie";

const fetchData = async ({
  setLoading,
  id,
  setError,
  setExam,
  setSelectedAnswers,
}) => {
  const token = getCookie("authToken");
  try {
    setLoading(true);
    setError(null);
    let response = await getRequest(`student/examPaper?id=${id}`, token);
    if (response?.statusCode === 200) {
      setExam(response?.data);
      localStorage.setItem("questionData", JSON.stringify(response?.data));
      let temArray = response?.data.length
        ? response?.data.map((val) => {
            return { question: val?._id, answer: "" };
          })
        : [];
      setSelectedAnswers(temArray);
      localStorage.setItem("selectedAnswerData", JSON.stringify(temArray));
    } else {
      setError(response?.message || "Error occurred");
    }
  } catch (error) {
    setError(error?.message || "Error occurred");
  } finally {
    setLoading(false);
  }
};

export default fetchData;
