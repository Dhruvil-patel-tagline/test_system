import React from "react";
import cancel from "../../../assets/cancel.png";
import ButtonCom from "../../../shared/ButtonCom";

const SubmitCancelBtn = ({ isUpdateForm }) => {
  return (
    <div className="btnSecondContainer">
      <ButtonCom color="red" type="reset" style={{ backgroundColor: "gray" }}>
        <span className="bntIcon">
          <img src={cancel} height="15px" width="15px" />
          Cancel
        </span>
      </ButtonCom>

      <ButtonCom type="submit">
        {isUpdateForm ? (
          <span style={{ color: "blue" }}>Update</span>
        ) : (
          <span style={{ color: "green" }}>Submit</span>
        )}
      </ButtonCom>
    </div>
  );
};

export default SubmitCancelBtn;
