import React from "react";
import InputCom from "../../../shared/InputCom";
import RadioCom from "../../../shared/RadioCom";
import { uniqueOpt } from "../../../utils/validate";

const Questions = ({
  examData,
  setExamData,
  questionsError,
  setQuestionsError,
  isDuplicateQuestion,
  currentQuestion,
}) => {
  const handleInputChange = (index, e) => {
    const value = e.target.value;
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [e.target.name]: value,
    };

    setExamData({ ...examData, questions: updatedQuestions });
    if (questionsError["questionError"]) {
      let error = null;
      if (!value.trim()) {
        error = "Question cannot be empty";
      } else if (isDuplicateQuestion(index, value)) {
        error = "Duplicate question not allowed";
      }
      setQuestionsError({ ...questionsError, questionError: error });
    }
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    if (!uniqueOpt(updatedQuestions[qIndex].options)) {
      setQuestionsError({
        ...questionsError,
        optionsError: "Same option not allowed",
      });
    } else {
      setQuestionsError({ ...questionsError, optionsError: "" });
    }
    updatedQuestions[qIndex].answer = "";
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index].answer = value;
    setQuestionsError({
      ...questionsError,
      answerError: value ? "" : "Answer is required",
    });
    setExamData({ ...examData, questions: updatedQuestions });
  };

  return (
    <div className="allQuestionContainer">
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="question">Question {currentQuestion + 1}</label>
        {questionsError?.questionError && (
          <span className="teacherError">{questionsError.questionError}</span>
        )}
        <InputCom
          name="question"
          type="text"
          placeholder="Enter question "
          id="question"
          value={examData?.questions[currentQuestion]?.question}
          onChange={(e) => handleInputChange(currentQuestion, e)}
        />
      </div>
      {questionsError?.optionsError && (
        <span className="teacherError">{questionsError.optionsError}</span>
      )}
      <div className="teacherOptionContainer">
        {examData?.questions[currentQuestion]?.options &&
          examData?.questions[currentQuestion]?.options.map((opt, idx) => (
            <div key={idx}>
              <InputCom
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(currentQuestion, idx, e.target.value)
                }
              />
            </div>
          ))}
      </div>
      <div style={{ padding: "20px 0px" }}>
        <span style={{ marginRight: "10px", fontSize: "1.5rem" }}>Answer:</span>
        <span style={{ color: "green", fontSize: "1.5rem" }}>
          {examData?.questions[currentQuestion]?.answer}
        </span>
        {questionsError?.answerError && (
          <span className="teacherError">{questionsError?.answerError}</span>
        )}
      </div>
      <div className="subTeacherContainer">
        {examData?.questions[currentQuestion]?.options &&
          examData?.questions[currentQuestion]?.options.map((opt, idx) => {
            if (!opt) return;
            return (
              <div key={idx} style={{ display: "flex", flexWrap: "wrap" }}>
                <RadioCom
                  name={`answer-${currentQuestion}`}
                  value={opt}
                  checked={examData.questions[currentQuestion].answer === opt}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion, e.target.value)
                  }
                  text={opt}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Questions;
