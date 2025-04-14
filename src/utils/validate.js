import { regexEmail, regexName, regexPassword } from "./regex";

const validate = (name, value, val2 = "") => {
  if (!value) {
    return `${name.charAt(0).toUpperCase() + name.substr(1)} is required`;
  }
  else if (typeof value === "string") {
    if (!value?.trim()) return `${name.charAt(0).toUpperCase() + name.substr(1)} is required`;
  }
  switch (name) {
    case "name": {
      if (!regexName.test(value)) return "Name is not valid";
      return null;
    }
    case "email": {
      if (!regexEmail.test(value)) return "Enter a valid email";
      return null;
    }
    case "password": {
      if (!regexPassword.test(value))
        return "This password is invalid. 6 should be the minimum length and 30 should be the maximum. password should only contain letters and digits";
      return null;
    }
    case "confirmPassword": {
      if (val2 !== "" && value !== val2) return "Passwords did not match";
      return null;
    }
    default:
      return null;
  }
};
export default validate;

export const validateEmpty = (name, text) => {
  if (!name?.trim()) return ` ${text} is required`;
  return null;
};

export const uniqueOpt = (optArray) => {
  if (!Array.isArray(optArray)) return false;
  return optArray.every((val, index, arr) => {
    if (!val) {
      return true;
    }
    return arr.every((val2, idx) => {
      if (idx == index) {
        return true;
      } else if (!val2) {
        return true;
      } else {
        return val2?.trim() !== val?.trim();
      }
    });
  });
};
