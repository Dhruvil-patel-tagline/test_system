import React from "react";
import InputCom from "./InputCom";
import RadioCom from "./RadioCom";
import ButtonCom from "./ButtonCom";
import "./css/form.css";

const FormCom = ({
    fields,
    initialValues,
    onSubmit,
    buttonText,
    secondaryButton,
    customValidation,
}) => {
    const [formData, setFormData] = React.useState(initialValues || {});
    const [errors, setErrors] = React.useState({});

    const handleChange = (field, value) => {
        // Update form data first
        const updatedFormData = { ...formData, [field]: value };
        setFormData(updatedFormData);

        // Clear error for this field immediately
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });

        // Run custom validation if provided
        if (customValidation) {
            const customErrors = customValidation(updatedFormData);
            if (customErrors[field]) {
                setErrors(prev => ({ ...prev, [field]: customErrors[field] }));
            }
        }
    };

    const validateField = (field, value) => {
        if (!value?.trim()) {
            return `${field} is required`;
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validate each field
        fields.forEach(field => {
            const value = formData[field.id];
            const error = validateField(field.name, value);
            if (error) {
                newErrors[field.id] = error;
                isValid = false;
            }
        });

        // Run custom validation if provided
        if (customValidation) {
            const customErrors = customValidation(formData);
            Object.assign(newErrors, customErrors);
            isValid = Object.keys(customErrors).length === 0;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.id,
            name: field.name,
            value: formData[field.id] || "",
            onChange: (e) => handleChange(field.id, e.target.value),
            error: errors[field.id],
            labelClassName: field.labelClassName || "formLabel",
            errorClassName: field.errorClassName || "formError"
        };

        switch (field.input) {
            case "input":
                return <InputCom key={field.id} {...commonProps} type={field.type} placeholder={field.placeholder} />;
            case "radio":
                return <RadioCom key={field.id} {...commonProps} options={field.options} />;
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formContainer">
            {fields.map(field => (
                <div key={field.id} className="formField">
                    <label htmlFor={field.id} className={field.labelClassName || "formLabel"}>
                        {field.name}
                    </label>
                    {renderField(field)}
                    {errors[field.id] && (
                        <span className={field.errorClassName || "formError"}>{errors[field.id]}</span>
                    )}
                </div>
            ))}
            <div className="formButtons">
                <ButtonCom type="submit" text={buttonText} />
                {secondaryButton && (
                    <ButtonCom
                        type="button"
                        text={secondaryButton.text}
                        onClick={secondaryButton.onClick}
                        color={secondaryButton.color}
                    />
                )}
            </div>
        </form>
    );
};

export default FormCom; 