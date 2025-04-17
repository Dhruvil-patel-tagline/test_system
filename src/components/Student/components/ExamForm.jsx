import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import edit from "../../assets/edit.svg";
import left from "../../assets/left.png";
import right from "../../assets/right.png";
import select from "../../assets/select.svg";
import { studentExamsAction } from "../../redux/action/studentExamsAction";
import ButtonCom from "../../shared/ButtonCom";
import Loader from "../../shared/Loader";
import RadioCom from "../../shared/RadioCom";
import Table from "../../shared/Table";
import { getRequest, postRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { examFormHeader } from "../../utils/staticObj";
import "./css/examForm.css";
import "./css/student.css";
import { useNavigationBlocker } from "./useNavigationBlocker";

const ExamForm = () => {
  const token = getCookie("authToken");
  const { state } = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id, subjectName, notes } = state;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnsIndex, setCurrentAnsIndex] = useState(0);

  const [exam, setExam] = useState(() => {
    let x = localStorage.getItem("questionData");
    return x ? JSON.parse(x) : [];
  });
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [remainingAnswer, setRemaining] = useState([]);
  const [timeLeft, setTimeLeft] = useState(
    localStorage.getItem("timeLeftData") || 120,
  );

  const [remainingAnsMode, setRemAnsMode] = useState(false);
  const [reviewMode, setReviewMode] = useState(() => {
    let x = localStorage.getItem("selectedAnswerData");
    return x && JSON.parse(x).some((value) => value.answer) ? true : false;
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    if (timeLeft === 30) {
      toast.warning("Only 30 seconds left! Hurry up!");
    }
    const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    localStorage.setItem("timeLeftData", timeLeft - 1);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    let x = localStorage.getItem("questionData");
    if (x) {
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response = await getRequest(`student/examPaper?id=${id}`, token);
        if (response?.statusCode === 200) {
          setExam(response?.data);
          localStorage.setItem("questionData", JSON.stringify(response?.data));
          let temArray =
            !!response?.data.length &&
            response?.data.map((val) => {
              return { question: val?._id, answer: "" };
            });
          setSelectedAnswers(temArray);
          localStorage.setItem("selectedAnswerData", JSON.stringify(temArray));
        } else {
          setError(response?.message || "Error occurred");
        }
      } catch (error) {
        setError(error?.message || "Error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleAnswerSelect = (questionId, option) => {
    let x = selectedAnswers.map((val) =>
      val?.question === questionId
        ? { question: questionId, answer: option }
        : val,
    );
    setSelectedAnswers(x);
    localStorage.setItem("selectedAnswerData", JSON.stringify(x));
  };

  const handleNext = () => setCurrentQuestionIndex((prev) => prev + 1);
  const handlePrev = () => setCurrentQuestionIndex((prev) => prev - 1);

  const handleSubmitAndReview = () => {
    setReviewMode(true);
    setRemAnsMode(false);
    setIsEditing(true);
    const data = selectedAnswers
      .map((val, index) => (!val.answer ? { ...exam[index], id: index } : null))
      .filter(Boolean);
    setRemaining(data);
  };

  const handleEditAnswer = (index) => {
    setCurrentQuestionIndex(index);
    setReviewMode(false);
  };

  const handleRemainingAnswer = (index) => {
    setCurrentAnsIndex(index);
    setRemAnsMode(true);
  };

  const remainingAnswerData = useMemo(() => {
    return remainingAnswer.map((q, idx) => ({
      Index: idx + 1,
      Question: q.question,
      Answer: "",
      Action: (
        <ButtonCom onClick={() => handleRemainingAnswer(idx)}>
          <span className="btnContainer">
            <img src={select} width="18px" height="18px" alt="select icon" />
            Select
          </span>
        </ButtonCom>
      ),
    }));
  }, [remainingAnswer]);

  const tableData = useMemo(() => {
    return exam.map((q, idx) => ({
      Index: idx + 1,
      Question: q.question,
      Answer: selectedAnswers[idx]?.answer,
      Action: (
        <ButtonCom onClick={() => handleEditAnswer(idx)}>
          <span className="btnContainer">
            <img src={edit} width="18px" height="18px" alt="edit icon" />
            Edit
          </span>
        </ButtonCom>
      ),
    }));
  }, [exam, selectedAnswers]);

  const submitExam = async () => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      const response = await postRequest(`student/giveExam?id=${id}`, {
        data: JSON.parse(localStorage.getItem("selectedAnswerData")),
        headers: { "access-token": token },
      });
      if (response.statusCode === 200) {
        navigate("/dashboard");
        dispatch({ type: "SET_EXAM_PENDING", payload: id });
        setTimeout(() => dispatch(studentExamsAction("submit")), 50000);
      } else {
        toast.error(response?.message);
      }
    } finally {
      setTimeout(() => {
        localStorage.removeItem("selectedAnswerData");
        localStorage.removeItem("timeLeftData");
        localStorage.removeItem("questionData");
      }, 5000);
      setLoading(false);
    }
  };

  const handleSubmit = (user) => {
    if (isSubmitting) return;
    if (user && remainingAnswerData.length > 0) {
      let confirmSubmit = confirm(
        `Do you intend to submit? You have ${remainingAnswerData.length} answers left.`,
      );
      if (!confirmSubmit) return;
    }
    submitExam();
  };

  useEffect(() => {
    const x = localStorage.getItem("selectedAnswerData");
    if (x) {
      setSelectedAnswers(JSON.parse(x));
    }
    if (x && JSON.parse(x).some((value) => value.answer)) {
      setReviewMode(true);
      setRemAnsMode(false);
      setIsEditing(true);
      const data = JSON.parse(x)
        .map((val, index) =>
          !val.answer ? { ...exam[index], id: index } : null,
        )
        .filter(Boolean);
      setRemaining(data);
    }
  }, []);
  useNavigationBlocker(true, submitExam);
  if (error) {
    return (
      <div className="examError">
        <p className="no-data"> {error || "Error occurred"}</p>
        <ButtonCom onClick={() => navigate(-1)}>Back</ButtonCom>
      </div>
    );
  }

  return (
    <div className="examRootCtn">
      {loading && <Loader />}
      <div className="examSecondRoot">
        <h1 className="heading" style={{ marginBottom: "10px" }}>
          {" "}
          Examination 2025{" "}
        </h1>
        <p style={{ color: timeLeft <= 30 ? "red" : "white" }}>
          Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </p>
        <div>
          <hr className="horizontalRule" />
          <div className="subjectContainer">
            <p>Subject : {subjectName}</p>
            <div>
              Notes:
              {!!notes?.length &&
                notes.map((res, idx) => (
                  <div key={idx}>
                    <p>{res}</p>
                  </div>
                ))}
            </div>
          </div>
          <div>
            {!reviewMode ? (
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
                        checked={
                          selectedAnswers[currentQuestionIndex]?.answer === opt
                        }
                        onChange={() =>
                          handleAnswerSelect(
                            exam[currentQuestionIndex]?._id,
                            opt,
                          )
                        }
                      />
                    );
                  })}
                </div>
                <div className="examBtnContainer">
                  <ButtonCom
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                  >
                    <span className="bntIcon">
                      <img src={left} height="15px" width="15px" />
                      Previous
                    </span>
                  </ButtonCom>
                  {isEditing && currentQuestionIndex !== exam.length - 1 && (
                    <ButtonCom onClick={handleSubmitAndReview}>
                      Submit & Review
                    </ButtonCom>
                  )}
                  {currentQuestionIndex < exam.length - 1 ? (
                    <ButtonCom onClick={handleNext}>
                      <span className="bntIcon">
                        Next
                        <img src={right} height="15px" width="15px" />
                      </span>
                    </ButtonCom>
                  ) : (
                    <ButtonCom onClick={handleSubmitAndReview}>
                      Submit & Review
                    </ButtonCom>
                  )}
                </div>
              </div>
            ) : !remainingAnsMode ? (
              <div className="remainingAnsContainer">
                <div>
                  <h2>Review Your Answers</h2>
                  <div>
                    <Table
                      tableData={tableData}
                      tableHeader={examFormHeader}
                      dataNotFound={!exam.length}
                    />
                  </div>
                </div>
                {!!remainingAnswerData.length && (
                  <div>
                    <h2>Remaining Answers</h2>
                    <div>
                      <Table
                        tableData={remainingAnswerData}
                        tableHeader={examFormHeader}
                        dataNotFound={!remainingAnswerData.length}
                      />
                    </div>
                  </div>
                )}
                <ButtonCom color="green" onClick={() => handleSubmit("user")}>
                  Final Submit
                </ButtonCom>
              </div>
            ) : (
              <div className="remainingAnsOptContainer">
                <p style={{ margin: "10px 0px", fontSize: "20px" }}>
                  Question {currentAnsIndex + 1}:
                  {remainingAnswer[currentAnsIndex]?.question}
                </p>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  {remainingAnswer[currentAnsIndex]?.options.map(
                    (opt, index) => {
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
                    },
                  )}
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
                  <ButtonCom onClick={handleSubmitAndReview}>
                    Submit & Review
                  </ButtonCom>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamForm;
