/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetForm } from "../redux/action/resetForm";
import { dropObj } from "../utils/staticObj";
import validate from "../utils/validate";
import ButtonCom from "./ButtonCom";
import DropDown from "./DropDown";
import InputCom from "./InputCom";
import InputPassword from "./InputPassword";
import RadioCom from "./RadioCom";

const ValidateDynamicForm = ({
  resetButton,
  initialValues,
  fields,
  customValidation,
  onSubmit,
}) => {
  const { formData, errors } = useSelector((state) => state.formData);
  const dispatch = useDispatch();

  const cancelButtonClass = resetButton ? "resetButton" : "";

  useEffect(() => {
    dispatch({ type: "SET_DATA", payload: initialValues });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({ type: "SET_DATA", payload: { [name]: value } });
    const field = fields.find((f) => f.id === name);

    if (field && errors[field.id]) {
      let error = null;
      if (field.validate) {
        error = field.validate(value, formData);
      } else {
        error = validate(field.id, value, formData);
      }
      dispatch({ type: "SET_ERROR", payload: { [name]: error } });
    }
  };

  const validateField = (field, value) => {
    if (field.validate) {
      return field.validate(value, formData);
    } else {
      return validate(field.id, value, formData);
    }
  };

  const resetFormData = () => {
    dispatch(resetForm());
  };

  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    if (customValidation) {
      const customErrors = customValidation(formData);
      if (customErrors && Object.keys(customErrors).length > 0) {
        Object.assign(newErrors, customErrors);
        isValid = false;
      }
    } else {
      fields.forEach((field) => {
        const value =
          field.value !== undefined ? field.value : formData[field.id];
        if (field.validate) {
          const error = field.validate(value, formData);
          if (error) {
            newErrors[field.id] = error;
            isValid = false;
          }
        } else {
          const error = validateField(field, value);
          if (error) {
            newErrors[field.id] = error;
            isValid = false;
          }
        }
      });
    }

    dispatch({ type: "REPLACE_ERROR", payload: newErrors });

    if (isValid) {
      onSubmit(formData, resetFormData);
    } else {
      toast.error("Please accurately fill out all the details.");
    }
  };

  const renderField = (field) => {
    const fieldValue =
      field.value !== undefined ? field.value : formData[field.id] || "";

    switch (field.input) {
      case "input":
        return (
          <div className="form-field">
            <InputCom
              type={field.type}
              id={field.id}
              name={field.id}
              value={fieldValue}
              onChange={(e) => {
                if (field.onChange) {
                  field.onChange(e);
                } else {
                  handleChange(e);
                }
              }}
              placeholder={field.placeholder}
            />
          </div>
        );
      case "password":
        return (
          <div className="form-field">
            <InputPassword
              id={field.id}
              name={field.id}
              value={fieldValue}
              onChange={field.onChange || handleChange}
              placeholder={field.placeholder}
            />
          </div>
        );
      case "dropdown":
        return (
          <div className="form-field">
            <DropDown
              id={field.id}
              name={field.id}
              value={fieldValue}
              onChange={field.onChange || handleChange}
              dropObj={field.dropObj || dropObj}
            />
          </div>
        );

      case "radio":
        return (
          <div className={`form-field ${field.className}`}>
            {field.options.map((opt, index) => {
              const radioId = `${field.id}-${opt}`;
              const isChecked =
                field.value === opt || formData[field.id] === opt;
              return (
                <div
                  key={`${opt}_ ${index}_${field?.id}`}
                  className="radio-option"
                >
                  <RadioCom
                    id={radioId}
                    text={opt}
                    name={field.id}
                    value={opt}
                    onChange={field.onChange || handleChange}
                    checked={isChecked}
                  />
                </div>
              );
            })}
          </div>
        );

      case "checkbox":
        return (
          <div className="form-field">
            <div className="checkbox-group">
              {field.options.map((opt) => {
                const checkboxId = `${field.id}-${opt}`;
                const isChecked =
                  Array.isArray(formData[field.id]) &&
                  formData[field.id].includes(opt);
                return (
                  <label
                    key={opt}
                    htmlFor={checkboxId}
                    style={{ marginRight: "10px" }}
                  >
                    <input
                      type="checkbox"
                      id={checkboxId}
                      name={field.id}
                      value={opt}
                      checked={isChecked}
                      onChange={handleChange}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "button":
        return (
          <div className={`formBtn ${field?.className}`}>
            <ButtonCom
              type={field.type}
              onClick={field.onClick}
              disabled={field.disabled}
            >
              {field.name}
            </ButtonCom>
          </div>
        );

      case "file":
        return (
          <div className="form-field">
            <input
              type="file"
              id={field.id}
              name={field.id}
              accept={field.accept}
              onChange={handleChange}
            />
          </div>
        );

      default:
        return <p style={{ color: "red" }}>Unsupported input type</p>;
    }
  };

  return { cancelButtonClass, handleSubmit, renderField, errors };
};

export default ValidateDynamicForm;
