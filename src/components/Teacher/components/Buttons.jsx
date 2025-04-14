import React from "react";
import left from "../../../assets/left.png";
import right from "../../../assets/right.png";
import ButtonCom from "../../../shared/ButtonCom";
import { TOTAL_QUESTIONS } from "../../../utils/staticObj";

const Buttons = ({ currentQuestion, handleQuestionSave }) => {
  return (
    <div className="btnGroup">
      <ButtonCom
        type="button"
        disabled={currentQuestion === 0}
        onClick={() => {
          handleQuestionSave(currentQuestion, "previous");
        }}
      >
        <span className="bntIcon">
          <img src={left} height="15px" width="15px" />
          Previous
        </span>
      </ButtonCom>
      <ButtonCom
        type="button"
        disabled={currentQuestion === TOTAL_QUESTIONS - 1}
        onClick={() => {
          handleQuestionSave(currentQuestion, "next");
        }}
      >
        <span className="bntIcon">
          Next
          <img src={right} height="15px" width="15px" />
        </span>
      </ButtonCom>
    </div>
  );
};

export default Buttons;
