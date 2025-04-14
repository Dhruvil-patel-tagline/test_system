/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cancel from "../../assets/cancel.png";
import left from "../../assets/left.png";
import right from "../../assets/right.png";
import { createExam, updateExam } from "../../redux/action/examActions";
import ButtonCom from "../../shared/ButtonCom";
import InputCom from "../../shared/InputCom";
import Loader from "../../shared/Loader";
import RadioCom from "../../shared/RadioCom";
import { getCookie } from "../../utils/getCookie";
import {
  questionsErrorObj,
  teacherErrorObj,
  TOTAL_QUESTIONS,
} from "../../utils/staticObj";
import validate from "../../utils/validate";
import "./css/teacher.css";

const TeacherForm = () => {
  const token = getCookie("authToken");
  const exams = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const isUpdateForm = pathname.includes("updateExam");

  const [currentQuestion, setCurrentQuestion] = useState(state?.currentQ || 0);
  const [allQuestionError, setAllQuestionError] = useState(
    Array(TOTAL_QUESTIONS).fill(false),
  );
  const [questionsError, setQuestionsError] = useState(questionsErrorObj);
  const [error, setError] = useState(teacherErrorObj);
  const [examData, setExamData] = useState({
    subjectName: state?.subject || "",
    questions:
      state?.questions ||
      Array(TOTAL_QUESTIONS)
        .fill()
        .map(() => ({
          question: "",
          answer: "",
          options: ["", "", "", ""],
        })),
    notes: state?.notes || ["", ""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormReset, setIsFormReset] = useState(false);

  const isDuplicateQuestion = (index, value) => {
    return examData.questions.some(
      (q, i) => i !== index && q?.question?.trim() === value?.trim(),
    );
  };

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

  const handleQueValidate = (index) => {
    const errors = {};
    errors.optionsError = "";
    const updatedQuestions = [...examData.questions];
    const value = updatedQuestions[index];
    if (validate("question", value.question)) {
      errors.questionError = "Question cannot be empty";
    } else if (isDuplicateQuestion(index, value?.question)) {
      errors.questionError = "Duplicate question not allowed";
    } else {
      errors.questionError = "";
    }
    errors.answerError = validate("Answer", updatedQuestions[index]?.answer);
    updatedQuestions[index]?.options.forEach((val) => {
      if (!val) {
        errors.optionsError = "4 option is required for each question";
      }
    });
    if (!uniqueOpt(updatedQuestions[index]?.options)) {
      errors.optionsError = "Same option not allowed";
    }
    setQuestionsError(errors);
    if (questionsError.optionsError) {
      return null;
    }
    return Object.values(errors).every((val) => !val);
  };

  const handleQuestionSave = (index, page) => {
    let allQue;
    if (handleQueValidate(index)) {
      allQue = allQuestionError.map((val, arrIndex) =>
        arrIndex === index ? true : val,
      );
      setAllQuestionError(allQue);
      page &&
        setCurrentQuestion(
          page === "previous" ? currentQuestion - 1 : currentQuestion + 1,
        );
    } else {
      allQue = allQuestionError.map((val, arrIndex) =>
        arrIndex === index ? false : val,
      );
      setAllQuestionError(allQue);
    }
    if (allQue) {
      allQue.every((val) => val) && setError({ ...error, queError: null });
    }
    return allQue;
  };

  function uniqueOpt(optArray) {
    return optArray.every((val, index, arr) => {
      if (!val) {
        return true;
      }
      return arr.every((val2, idx) => {
        if (idx == index) {
          return true;
        } else if (!val2) {
          return true;
        } else {
          return val2.trim() !== val.trim();
        }
      });
    });
  }

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
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setExamData({ ...examData, subjectName: value });
    if (error["subjectError"]) {
      setError({ ...error, subjectError: validate("Subject name", value) });
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...examData.notes];
    updatedNotes[index] = value;
    if (error["noteError"]) {
      let notesError = null;
      if (!updatedNotes.every((note) => note.trim() !== "")) {
        notesError = "Notes are required";
      }
      if (updatedNotes[0].trim() === updatedNotes[1].trim()) {
        notesError = "Notes can not be same";
      }
      setError({ ...error, noteError: notesError });
    }
    setExamData({ ...examData, notes: updatedNotes });
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

  const handleValidate = useCallback(
    (result) => {
      const errors = { ...teacherErrorObj };
      errors.subjectError = validate("Subject name", examData.subjectName);
      if (!examData.notes.every((note) => note.trim() !== "")) {
        errors.noteError = "Notes are required";
      } else if (examData.notes[0].trim() === examData.notes[1].trim()) {
        errors.noteError = "Notes can not be same";
      }
      setError(errors);
      if (result) {
        if (!result.every((val) => val)) {
          errors.queError = "Please fill out all the question";
          toast.error("Please fill out all the question");
        }
      }
      return Object.values(errors).every((val) => !val);
    },
    [examData],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = handleQuestionSave(currentQuestion);
    if (!handleValidate(result)) return;
    setIsSubmitting(true);
  };

  const resetForm = () => {
    setExamData({
      subjectName: "",
      questions: Array(TOTAL_QUESTIONS)
        .fill()
        .map(() => ({
          question: "",
          answer: "",
          options: ["", "", "", ""],
        })),
      notes: ["", ""],
    });
    setQuestionsError(questionsErrorObj);
    setAllQuestionError(Array(TOTAL_QUESTIONS).fill(false));
    setError(teacherErrorObj);
    setIsFormReset(true);
  };

  useEffect(() => {
    if (isSubmitting) {
      if (isUpdateForm) {
        dispatch(updateExam(examData, state?.examId, token, navigate));
      } else {
        dispatch(createExam(examData, token, navigate));
      }
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (isFormReset) {
      setCurrentQuestion(0);
      setIsFormReset(false);
    }
  }, [isFormReset]);

  useEffect(() => {
    if (state?.questions) {
      setAllQuestionError(Array(TOTAL_QUESTIONS).fill(true));
    }
  }, [isUpdateForm]);
  if (isUpdateForm) {
    if (!state?.questions) {
      return (
        <div className="teacherFormErrorContainer">
          <p style={{ paddingTop: "70px", marginBottom: "10px" }}>
            Error occurred
          </p>
          <ButtonCom type="button" color="white" onClick={() => navigate(-1)}>
            Back
          </ButtonCom>
        </div>
      );
    }
  }
  return (
    <div>
      <div style={{ paddingTop: "20px" }}>
        {exams?.loading && <Loader />}
        <h1 className="teacherFormHeading">
          {isUpdateForm ? "Edit Exam" : "Create Exam"}
        </h1>
        <div className="teacherFormInner">
          <form
            onSubmit={handleSubmit}
            onReset={resetForm}
            style={{ maxWidth: "1100px" }}
          >
            <label htmlFor="subjectName" style={{ fontSize: "20px" }}>
              Subject Name
            </label>
            {error?.subjectError && (
              <span className="teacherError">{error.subjectError}</span>
            )}
            <InputCom
              type="text"
              name="subjectName"
              id="subjectName"
              value={examData.subjectName}
              onChange={handleSubjectChange}
              placeholder="Subject Name"
            />
            <label className="teacherLabel">Question</label>
            <div>
              <div className="allQuestionContainer">
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="question">
                    Question {currentQuestion + 1}
                  </label>
                  {questionsError?.questionError && (
                    <span className="teacherError">
                      {questionsError.questionError}
                    </span>
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
                  <span className="teacherError">
                    {questionsError.optionsError}
                  </span>
                )}
                <div className="teacherOptionContainer">
                  {examData?.questions[currentQuestion]?.options &&
                    examData?.questions[currentQuestion]?.options.map(
                      (opt, idx) => (
                        <div key={idx}>
                          <InputCom
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(
                                currentQuestion,
                                idx,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ),
                    )}
                </div>
                <div style={{ padding: "20px 0px" }}>
                  <span style={{ marginRight: "10px", fontSize: "1.5rem" }}>
                    Answer:
                  </span>
                  <span style={{ color: "green", fontSize: "1.5rem" }}>
                    {examData?.questions[currentQuestion]?.answer}
                  </span>
                  {questionsError?.answerError && (
                    <span className="teacherError">
                      {questionsError?.answerError}
                    </span>
                  )}
                </div>
                <div className="subTeacherContainer">
                  {examData?.questions[currentQuestion]?.options &&
                    examData?.questions[currentQuestion]?.options.map(
                      (opt, idx) => {
                        if (!opt) return;
                        return (
                          <div
                            key={idx}
                            style={{ display: "flex", flexWrap: "wrap" }}
                          >
                            <RadioCom
                              name={`answer-${currentQuestion}`}
                              value={opt}
                              checked={
                                examData.questions[currentQuestion].answer ===
                                opt
                              }
                              onChange={(e) =>
                                handleAnswerChange(
                                  currentQuestion,
                                  e.target.value,
                                )
                              }
                              text={opt}
                            />
                          </div>
                        );
                      },
                    )}
                </div>
              </div>
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
            </div>
            <label style={{ fontSize: "20px" }}>Notes</label>
            {error?.noteError && (
              <span className="teacherError">{error.noteError}</span>
            )}
            {examData.notes.map((note, index) => (
              <InputCom
                key={index}
                type="text"
                placeholder={`Note ${index + 1}`}
                value={note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            ))}
            <div className="btnSecondContainer">
              <ButtonCom
                color="red"
                type="reset"
                style={{ backgroundColor: "gray" }}
              >
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
