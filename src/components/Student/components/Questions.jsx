import React from "react";
import left from "../../../assets/left.png";
import right from "../../../assets/right.png";
import ButtonCom from "../../../shared/ButtonCom";
import RadioCom from "../../../shared/RadioCom";

const Questions = ({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  exam,
  selectedAnswers,
  handleSubmitAndReview,
  handleAnswerSelect,
  isEditing,
}) => {
  const handleNext = () => setCurrentQuestionIndex((prev) => prev + 1);
  const handlePrev = () => setCurrentQuestionIndex((prev) => prev - 1);

  return (
    <div>
      <p style={{ margin: "10px 0px", fontSize: "20px" }}>
        Question {currentQuestionIndex + 1}:{" "}
        {exam[currentQuestionIndex]?.question}
      </p>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {exam[currentQuestionIndex]?.options.map((opt, index) => {
          return (
            <RadioCom
              key={index}
              text={opt}
              value={opt}
              name={`option-${currentQuestionIndex}`}
              checked={selectedAnswers[currentQuestionIndex]?.answer === opt}
              onChange={() =>
                handleAnswerSelect(exam[currentQuestionIndex]?._id, opt)
              }
            />
          );
        })}
      </div>
      <div className="examBtnContainer">
        <ButtonCom onClick={handlePrev} disabled={currentQuestionIndex === 0}>
          <span className="bntIcon">
            <img src={left} height="15px" width="15px" />
            Previous
          </span>
        </ButtonCom>
        {isEditing && currentQuestionIndex !== exam.length - 1 && (
          <ButtonCom onClick={handleSubmitAndReview}>Submit & Review</ButtonCom>
        )}
        {currentQuestionIndex < exam.length - 1 ? (
          <ButtonCom onClick={handleNext}>
            <span className="bntIcon">
              Next
              <img src={right} height="15px" width="15px" />
            </span>
          </ButtonCom>
        ) : (
          <ButtonCom onClick={handleSubmitAndReview}>Submit & Review</ButtonCom>
        )}
      </div>
    </div>
  );
};

export default Questions;
