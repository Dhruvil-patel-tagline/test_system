import "./css/button.css";

const ButtonCom = ({ onClick, type, disabled, color, children, bgColor }) => {
  return (
    <>
      <button
        className={`button ${disabled ? "button-disabled" : ""} ${bgColor ? "bgColor" : ""}`}
        disabled={disabled}
        style={{ "--button-color": color, '--bg-color': bgColor }}
        type={type}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export default ButtonCom;
