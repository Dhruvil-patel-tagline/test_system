// shared/ReusableForm.jsx
import { Fragment, useState } from "react";
import { dropObj } from "../utils/staticObj";
import validate from "../utils/validate";
import ButtonCom from "./ButtonCom";
import DropDown from "./DropDown";
import InputCom from "./InputCom";
import InputPassword from "./InputPassword";
import RadioCom from "./RadioCom";

const DynamicForm = ({
  fields,
  initialValues = [],
  onSubmit,
  buttonText = "Submit",
  secondaryButton = null,
  //   customValidation = null,
}) => {
  const [formData, setFormData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
    if (errors[name]) {
      const newErrors = validate(name, value);
      setErrors({ ...errors, [name]: newErrors });
    }
  };

   
  const handleValidation = () => {
    let errorObj = {};
    Object.entries(formData).forEach(([key, val]) => {
      //  if(Array.isArray(val)){
      //  }
      errorObj[key] = validate(key, val);
    });
    setErrors(errorObj);
    return Object.values(errorObj).every((val) => !val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formData, setFormData, setErrors);
    }
  };

  const renderField = (field) => {
    switch (field.input) {
      case "input":
        return (
          <InputCom
            type={field.type}
            id={field.id}
            name={field.id}
            value={formData[field.id]}
            onChange={field?.onChange || handleChange}
            placeholder={field.placeholder}
          />
        );
      case "password":
        return (
          <InputPassword
            id={field.id}
            name={field.id}
            value={formData[field.id]}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        );
      case "dropdown":
        return (
          <DropDown
            id={field.id}
            name={field.id}
            value={formData[field.id]}
            onChange={handleChange}
            dropObj={dropObj}
          />
        );

      case "radio":
        return field.options.map((opt) => (
          <RadioCom
            text={opt}
            name={field.id}
            value={opt}
            onChange={handleChange}
            checked={formData[field.id] === opt}
          />
        ));

      case "checkbox":
        return field.options.map((opt) => (
          <label key={opt} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              name={field.id}
              value={opt}
              checked={formData[field.id]?.includes(opt)}
              onChange={handleChange}
            />
            {opt}
          </label>
        ));

      case "file":
        return (
          <input
            type="file"
            id={field.id}
            name={field.id}
            accept={field.accept}
            onChange={handleChange}
          />
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

      default: {
        return <p style={{ color: "red" }}>Unsupported input type</p>;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {fields.map((field) => (
        <Fragment key={field.id}>
          {(!field?.NoLabel || field.placeholder === "Option 1") && (
            <>
              <label htmlFor={field.id}>{field.name}</label>
              <span className="error">{errors[field.id]}</span>
            </>
          )}
          {renderField(field)}
        </Fragment>
      ))}

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
              setFormData(initialValues);
              setErrors(initialValues);
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

export default DynamicForm;
