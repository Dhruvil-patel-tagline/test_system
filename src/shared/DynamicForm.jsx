import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { dropObj } from "../utils/staticObj";
import ButtonCom from "./ButtonCom";
import "./css/dynamicForm.css";
import DropDown from "./DropDown";
import InputCom from "./InputCom";
import InputPassword from "./InputPassword";
import RadioCom from "./RadioCom";
import useDynamicForm from "./useDynamicForm";

const DynamicForm = ({
  fields,
  initialValues,
  onSubmit,
  buttonText = "Submit",
  resetButton,
  customValidation = null,
}) => {
  const dispatch = useDispatch();
  const { handleSubmit, errors, handleChange, formData } = useDynamicForm({
    initialValues,
    fields,
    customValidation,
    onSubmit,
  });

  const cancelButtonClass = resetButton ? "resetButton" : "";

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
          <div
            className={`formBtn ${field?.className}`}
            style={{ marginTop: "20px" }}
          >
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

  return (
    <form onSubmit={handleSubmit} className="form">
      {fields.map((field) => {
        const fieldError =
          field.error !== undefined ? field.error : errors[field.id];
        return (
          <Fragment key={field.id}>
            {(!field?.noText ||
              ["Option 1", "Note 1"].includes(field.placeholder)) && (
              <div style={{ marginTop: "20px" }}>
                {field?.noLabel ? (
                  <span>{field.name}</span>
                ) : (
                  <label htmlFor={field.id}>{field.name}</label>
                )}
                {fieldError && (
                  <span
                    className="error"
                    style={{ color: "red", marginTop: "5px" }}
                  >
                    {fieldError}
                  </span>
                )}
              </div>
            )}
            {renderField(field)}
          </Fragment>
        );
      })}

      <div className={`submit-btn-from ${cancelButtonClass}`}>
        {resetButton && (
          <ButtonCom
            type="reset"
            onClick={() => {
              if (typeof resetButton === "function") {
                resetButton();
              }
              dispatch({ type: "RESET_DATA" });
            }}
            color="red"
          >
            Cancel
          </ButtonCom>
        )}
        <ButtonCom type="submit" color="green">
          {buttonText}
        </ButtonCom>
      </div>
    </form>
  );
};

export default DynamicForm;
