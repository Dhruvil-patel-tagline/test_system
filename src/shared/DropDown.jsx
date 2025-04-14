import "./css/dropdown.css";

const DropDown = ({ value, onChange, dropObj, id, name }) => {
  return (
    <div style={{ padding: "10px 0px" }}>
      <select
        className="dropdown"
        value={value}
        onChange={onChange}
        id={id}
        name={name}
      >
        {dropObj.map((val) => (
          <option key={val.value} value={val.value}>
            {val.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
