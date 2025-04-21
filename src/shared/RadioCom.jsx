import { useId } from "react";
import "./css/radio.css";

const RadioCom = ({
  text,
  name,
  value,
  onChange,
  checked,
  disabled = false,
}) => {
  const id = useId();
  return (
    <>
      <div style={{ margin: "10px 0px" }}>
        <input
          type="radio"
          className="radio"
          checked={checked}
          id={id}
          name={name}
          disabled={disabled}
          onChange={onChange}
          value={value}
        />
        <label
          htmlFor={id}
          style={{
            marginLeft: "5px",
            cursor: "pointer",
            color: disabled ? "gray" : "inherit",
          }}
        >
          {text}
        </label>
      </div>
    </>
  );
};

export default RadioCom;
