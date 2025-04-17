/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetForm } from "../redux/action/resetForm";
import validate from "../utils/validate";

const useDynamicForm = ({
  initialValues,
  fields,
  customValidation,
  onSubmit,
}) => {
  const { formData, errors } = useSelector((state) => state.formData);
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch({ type: "SET_DATA", payload: initialValues });
  }, [initialValues]);

  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({ type: "SET_DATA", payload: { [name]: value } });
    const field = fields.find((f) => f.id === name);

    if (field && errors[field.id]) {
      let error = field.validate
        ? field.validate(value, formData)
        : validate(field.id, value, formData);
      dispatch({ type: "SET_ERROR", payload: { [name]: error } });
    }
  };

  const resetFormData = () => {
    dispatch(resetForm());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};
    if (customValidation) {
      const customErrors = customValidation(formData);
      if (!customErrors) {
        isValid = false;
        toast.error("Please accurately fill out all the details.");
      }
    } else {
      fields.forEach((field) => {
        const value = field.value || formData[field.id];
        const error = field.validate
          ? field.validate(value, formData)
          : validate(field.id, value, formData);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      });
      dispatch({ type: "REPLACE_ERROR", payload: newErrors });
    }
    if (isValid) {
      onSubmit(formData, resetFormData);
    }
  };

  return { handleSubmit, errors, handleChange, formData };
};

export default useDynamicForm;
