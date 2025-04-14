/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonCom from "../../shared/ButtonCom";
import Loader from "../../shared/Loader";
import examFormSubmit from "./components/examFormSubmit";
import ExamTables from "./components/ExamTables";
import fetchData from "./components/fetchData";
import Questions from "./components/Questions";
import RemainingAns from "./components/RemainingAns";
import TimeLeft from "./components/timeLeft";
import { useNavigationBlocker } from "./components/useNavigationBlocker";
import "./css/examForm.css";
import "./css/student.css";
import AuthRoute from "../auth/AuthRoute";
const ExamForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id, subjectName, notes } = state;
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnsIndex, setCurrentAnsIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [remainingAnswer, setRemaining] = useState([]);
  const [remainingAnsMode, setRemAnsMode] = useState(false);
  const [exam, setExam] = useState(
    JSON.parse(localStorage.getItem("questionData")) || [],
  );
  const [reviewMode, setReviewMode] = useState(() => {
    let x = localStorage.getItem("selectedAnswerData");
    return x && JSON.parse(x).some((value) => value.answer) ? true : false;
  });

  useEffect(() => {
    if (!localStorage.getItem("questionData")) {
      fetchData({ setLoading, id, setError, setExam, setSelectedAnswers });
    }
  }, [id]);

  const handleAnswerSelect = (questionId, option) => {
    let x = selectedAnswers.map((val) =>
      val?.question === questionId
        ? { question: questionId, answer: option }
        : val,
    );
    setSelectedAnswers(x);
    localStorage.setItem("selectedAnswerData", JSON.stringify(x));
  };

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

  const submitExam = (val) => {
    examFormSubmit({ setLoading, navigate, id, dispatch, val });
  };

  let remainingAnswerData = [];
  function remainingDataFun(data) {
    remainingAnswerData = data;
  }

  const handleSubmit = (user) => {
    if (user && remainingAnswerData.length > 0) {
      let confirmSubmit = confirm(
        `Do you intend to submit? You have ${remainingAnswerData.length} answers left.`,
      );
      if (!confirmSubmit) return;
    }
    setIsSubmitting(true);
    submitExam("withoutNavigation");
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

  useNavigationBlocker(true, submitExam, isSubmitting);

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
          Examination 2025
        </h1>
        <TimeLeft
          setIsSubmitting={setIsSubmitting}
          handleSubmit={handleSubmit}
        />
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
              <Questions
                exam={exam}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                selectedAnswers={selectedAnswers}
                handleSubmitAndReview={handleSubmitAndReview}
                handleAnswerSelect={handleAnswerSelect}
                isEditing={isEditing}
              />
            ) : !remainingAnsMode ? (
              <ExamTables
                exam={exam}
                selectedAnswers={selectedAnswers}
                handleSubmit={handleSubmit}
                handleRemainingAnswer={handleRemainingAnswer}
                remainingAnswer={remainingAnswer}
                handleEditAnswer={handleEditAnswer}
                remainingDataFun={remainingDataFun}
              />
            ) : (
              <RemainingAns
                remainingAnswer={remainingAnswer}
                selectedAnswers={selectedAnswers}
                handleAnswerSelect={handleAnswerSelect}
                handleSubmitAndReview={handleSubmitAndReview}
                exam={exam}
                currentAnsIndex={currentAnsIndex}
                setCurrentAnsIndex={setCurrentAnsIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ['student'] })(ExamForm);
