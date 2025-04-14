import { regexEmail, regexName } from "./regex";

export const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  if (!regexName.test(name)) return "Name is not valid";
  return null;
};

export const validateEmpty = (name, text) => {
  if (!name.trim()) return ` ${text} is required`;
  return null;
};

export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!regexEmail.test(email)) return "Enter a valid email";
  return null;
};

export const validatePassword = (password, confirmPassword) => {
  if (!password.trim()) return "Password is required";
  // if (!regexPassword.test(password)) return 'Password is too weak';
  if (confirmPassword !== undefined && password !== confirmPassword)
    return "Passwords did not match";
  return null;
};

export const dropDownValidate = (option, optionName) => {
  if (!option.trim()) return `Select ${optionName} please.`;
  return null;
};
