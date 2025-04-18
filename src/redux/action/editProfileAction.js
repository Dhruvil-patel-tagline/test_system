import { toast } from "react-toastify";
import { putRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";

export const editProfileAction =
  ({ formData, resetFormData, user, navigate }) =>
  async (dispatch) => {
    const token = getCookie("authToken");

    if (formData?.name === user?.name) {
      toast.error("Updating name is same as actual name");
      return;
    }
    try {
      dispatch({ type: "SUBMIT_DYNAMIC_FORM" });
      const response = await putRequest("student/studentProfile", formData, {
        "access-token": token,
      });
      if (response.statusCode === 200) {
        toast.success("Name updated Successfully");
        navigate("/profile");
        document.cookie = `authUser=${JSON.stringify({ ...user, name: formData.name })};path=/; max-age=${60 * 60}; secure`;
        resetFormData();
      } else {
        toast.error(response?.message || "Error occurred");
      }
    } finally {
      dispatch({ type: "SUBMIT_EXAM_LOADING" });
    }
  };
