import { Fragment, useEffect } from "react";
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

const FormCom = ({
  fields,
  initialValues,
  onSubmit,
  buttonText = "Submit",
  resetButton,
  customValidation = null,
}) => {
  const { formData, errors } = useSelector((state) => state.formData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SET_DATA", payload: initialValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const trimmedValue =
      value && typeof value === "string" ? value.trim() : value;
    dispatch({ type: "SET_DATA", payload: { [name]: trimmedValue } });
    const field = fields.find((f) => f.id === name);

    if (field) {
      let error = null;
      if (field.validate) {
        error = field.validate(trimmedValue, formData);
      } else {
        error =
          field.id === "confirmPassword"
            ? validate(field.id, trimmedValue, formData.password)
            : validate(field.id, trimmedValue);
      }
      dispatch({ type: "SET_ERROR", payload: { [name]: error } });
    }
  };

  const validateField = (field, value) => {
    if (field.validate) {
      return field.validate(value, formData);
    } else if (field.id === "confirmPassword") {
      return validate(field.id, value, formData.password);
    } else {
      return validate(field.id, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

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

    if (customValidation) {
      const customErrors = customValidation(formData);
      if (customErrors && Object.keys(customErrors).length > 0) {
        Object.assign(newErrors, customErrors);
        isValid = false;
      }
    }
    dispatch({ type: "REPLACE_ERROR", payload: newErrors });

    if (isValid) {
      onSubmit(formData);
      dispatch(resetForm());
    } else {
      toast.error("Please fill out all the Details");
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
          <div className="form-field">
            <div className="radio-group">
              {field.options.map((opt) => {
                const radioId = `${field.id}-${opt}`;
                const isChecked =
                  field.value === opt || formData[field.id] === opt;
                return (
                  <div key={opt} className="radio-option">
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
          <ButtonCom
            type={field.type}
            onClick={field.onClick}
            disabled={field.disabled}
          >
            {field.name}
          </ButtonCom>
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

      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "10px 0px",
        }}
      >
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

export default FormCom;
