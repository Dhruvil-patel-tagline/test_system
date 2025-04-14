// shared/ReusableForm.jsx
import { Fragment, useState } from "react";
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
  secondaryButton = null,
  customValidation = null,
}) => {
  const [formData, setFormData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only trim if value exists and has trim method
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;

    // Update form data first
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));

    // Find the field configuration
    const field = fields.find(f => f.id === name);

    // Clear existing error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Run validation if field exists
    if (field) {
      let error = null;

      // First check field-specific validation
      if (field.validate) {
        error = field.validate(trimmedValue, formData);
      } else {
        // Fall back to default validation based on input type
        switch (field.input) {
          case "input":
          case "password":
            error = validate(field.id, trimmedValue);
            break;
          case "radio":
            error = !trimmedValue ? `${field.name} is required` : null;
            break;
          case "dropdown":
            error = !trimmedValue ? `Please select ${field.name}` : null;
            break;
          default:
            error = null;
        }
      }

      // Set error if validation failed
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const validateField = (field, value) => {
    if (field.validate) {
      return field.validate(value, formData);
    }

    switch (field.input) {
      case "input":
      case "password":
        return validate(field.id, value);
      case "radio":
        return !value ? `${field.name} is required` : null;
      case "dropdown":
        return !value ? `Please select ${field.name}` : null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    if (customValidation) {
      const customErrors = customValidation(formData);
      if (customErrors) {
        Object.assign(newErrors, customErrors);
        isValid = isValid && Object.keys(customErrors).length === 0;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // First validate all fields
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      // Get the value either from field.value or formData
      const value = field.value !== undefined ? field.value : formData[field.id];

      // First try field's own validation
      if (field.validate) {
        const error = field.validate(value, formData);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      } else {
        // Fall back to default validation
        const error = validateField(field, value);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      }
    });

    // Run custom validation if provided
    if (customValidation) {
      const customErrors = customValidation(formData);
      if (customErrors && Object.keys(customErrors).length > 0) {
        Object.assign(newErrors, customErrors);
        isValid = false;
      }
    }

    // Update error state
    setErrors(newErrors);

    // If valid, call onSubmit
    if (isValid) {
      onSubmit(formData, setFormData, setErrors);
    }
  };

  const renderField = (field) => {
    const inputId = `form-field-${field.id}`;
    // Use field.error directly if provided, otherwise use internal errors state
    const fieldError = field.error !== undefined ? field.error : errors[field.id];
    const fieldValue = field.value !== undefined ? field.value : (formData[field.id] || "");

    switch (field.input) {
      case "input":
        return (
          <div className="form-field">
            <InputCom
              type={field.type}
              id={inputId}
              name={field.id}
              value={fieldValue}
              onChange={(e) => {
                // Call custom onChange if provided
                if (field.onChange) {
                  field.onChange(e);
                } else {
                  handleChange(e);
                }
              }}
              placeholder={field.placeholder}
            />
            {fieldError && <span className="error" style={{ color: 'red', display: 'block', marginTop: '5px' }}>{fieldError}</span>}
          </div>
        );
      case "password":
        return (
          <div className="form-field">
            <InputPassword
              id={inputId}
              name={field.id}
              value={fieldValue}
              onChange={field.onChange || handleChange}
              placeholder={field.placeholder}
            />
            {fieldError && <span className="error" style={{ color: 'red', display: 'block', marginTop: '5px' }}>{fieldError}</span>}
          </div>
        );
      case "dropdown":
        return (
          <div className="form-field">
            <DropDown
              id={inputId}
              name={field.id}
              value={fieldValue}
              onChange={field.onChange || handleChange}
              dropObj={field.dropObj || dropObj}
            />
            {fieldError && <span className="error" style={{ color: 'red', display: 'block', marginTop: '5px' }}>{fieldError}</span>}
          </div>
        );

      case "radio":
        return (
          <div className="form-field">
            {fieldError && <span className="error">{fieldError}</span>}
            <div className="radio-group">
              {field.options.map((opt) => {
                const radioId = `${inputId}-${opt}`;
                const isChecked = field.value === opt || formData[field.id] === opt;
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
            {fieldError && <span className="error">{fieldError}</span>}
            <div className="checkbox-group">
              {field.options.map((opt) => {
                const checkboxId = `${inputId}-${opt}`;
                const isChecked = Array.isArray(formData[field.id]) && formData[field.id].includes(opt);
                return (
                  <label key={opt} htmlFor={checkboxId} style={{ marginRight: "10px" }}>
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

      case "file":
        return (
          <div className="form-field">
            {fieldError && <span className="error">{fieldError}</span>}
            <input
              type="file"
              id={inputId}
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
        const inputId = `form-field-${field.id}`;
        return (
          <Fragment key={field.id}>
            <div className="form-group">
              <label htmlFor={inputId}>{field.name}</label>
              {renderField(field)}
            </div>
            <br />
          </Fragment>
        );
      })}

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {secondaryButton && (
          <ButtonCom
            type="button"
            onClick={() => {
              if (secondaryButton.onClick) secondaryButton.onClick();
              setFormData(initialValues || {});
              setErrors({});
            }}
            color={secondaryButton.color || "default"}
          >
            {secondaryButton.text || "Cancel"}
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
