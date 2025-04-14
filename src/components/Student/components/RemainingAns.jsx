import left from "../../../assets/left.png";
import right from "../../../assets/right.png";
import ButtonCom from "../../../shared/ButtonCom";
import RadioCom from "../../../shared/RadioCom";

const RemainingAns = ({
  remainingAnswer,
  selectedAnswers,
  handleAnswerSelect,
  exam,
  currentAnsIndex,
  setCurrentAnsIndex,
  handleSubmitAndReview,
}) => {
  return (
    <>
      <div className="remainingAnsOptContainer">
        <p style={{ margin: "10px 0px", fontSize: "20px" }}>
          Question {currentAnsIndex + 1}:
          {remainingAnswer[currentAnsIndex]?.question}
        </p>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {remainingAnswer[currentAnsIndex]?.options.map((opt, index) => {
            return (
              <RadioCom
                key={index}
                text={opt}
                value={opt}
                name={`option-${remainingAnswer[currentAnsIndex].id}`}
                checked={
                  selectedAnswers[remainingAnswer[currentAnsIndex].id]
                    ?.answer === opt
                }
                onChange={() =>
                  handleAnswerSelect(
                    exam[remainingAnswer[currentAnsIndex].id]?._id,
                    opt,
                  )
                }
              />
            );
          })}
        </div>
        <div className="examBtnContainer">
          <ButtonCom
            disabled={currentAnsIndex === 0}
            onClick={() => setCurrentAnsIndex(currentAnsIndex - 1)}
          >
            <span className="bntIcon">
              <img src={left} height="15px" width="15px" />
              Previous
            </span>
          </ButtonCom>
          <ButtonCom onClick={handleSubmitAndReview}>Submit & Review</ButtonCom>
          <ButtonCom
            disabled={currentAnsIndex >= remainingAnswer.length - 1}
            onClick={() => setCurrentAnsIndex(currentAnsIndex + 1)}
          >
            <span className="bntIcon">
              Next
              <img src={right} height="15px" width="15px" />
            </span>
          </ButtonCom>
        </div>
      </div>
    </>
  );
};

export default RemainingAns;
