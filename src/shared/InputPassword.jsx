import { useState } from "react";
import eyesClose from "../assets/eyesClose.png";
import eyesOpen from "../assets/eyesOpen.png";
import "./css/passwordInput.css";

const InputPassword = ({ name, id, value, onChange, placeholder }) => {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyesClose);
  const handleToggle = () => {
    if (type === "password") {
      setIcon(eyesOpen);
      setType("text");
    } else {
      setIcon(eyesClose);
      setType("password");
    }
  };
  return (
    <div className="inputWithImg">
      <input
        style={{ paddingRight: "60px" }}
        className="input"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="on"
      />
      <img
        src={icon}
        alt="password icon"
        width="25px"
        height="25px"
        onClick={handleToggle}
      />
    </div>
  );
};

export default InputPassword;
