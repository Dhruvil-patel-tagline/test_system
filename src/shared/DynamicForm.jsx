import React from "react";
import { useDispatch } from "react-redux";
import ValidateDynamicForm from "./ValidateDynamicForm";

const DynamicForm = ({
  fields,
  initialValues,
  onSubmit,
  buttonText = "Submit",
  resetButton,
  customValidation = null,
}) => {
  const dispatch = useDispatch();
  const { cancelButtonClass, handleSubmit, renderField, errors } =
    ValidateDynamicForm({
      resetButton,
      initialValues,
      fields,
      customValidation,
      onSubmit,
    });
    
  return (
    <form onSubmit={handleSubmit} className="form">
      {fields.map((field) => {
        const fieldError =
          field.error !== undefined ? field.error : errors[field.id];
        return (
          <Fragment key={field.id}>
            {(!field?.NoLabel ||
              ["Option 1", "Note 1"].includes(field.placeholder)) && (
              <div>
                <label htmlFor={field.id}>{field.name}</label>
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
