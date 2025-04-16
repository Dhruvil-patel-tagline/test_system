/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createExam, updateExam } from "../../../redux/action/examActions";
import { getCookie } from "../../../utils/getCookie";
import {
  questionsErrorObj,
  teacherErrorObj,
  TOTAL_QUESTIONS,
} from "../../../utils/staticObj";
import validate, { uniqueOpt } from "../../../utils/validate";

const TeacherFormValidate = ({ isUpdateForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.formData);
  const {
    currentQ = 0,
    examId,
    notes = [],
    questions = [],
    subjectName = "",
    errors = {
      error: teacherErrorObj,
      allQuestionError: Array(TOTAL_QUESTIONS).fill(false),
      questionsError: questionsErrorObj,
    },
  } = formData.formData;

  // console.log(currentQ, examId);
  const token = getCookie("authToken");
  // const [currentQuestion, setCurrentQuestion] = useState(currentQ || 0);
  // const [allQuestionError, setAllQuestionError] = useState(
  //   Array(TOTAL_QUESTIONS).fill(false),
  // );

  // const [questionsError, setQuestionsError] = useState(questionsErrorObj);

  // const [error, setError] = useState(teacherErrorObj);

  // const [examData, setExamData] = useState({
  //   subjectName: state?.subject || "",
  //   questions:
  //     state?.questions ||
  //     Array(TOTAL_QUESTIONS)
  //       .fill()
  //       .map(() => ({
  //         question: "",
  //         answer: "",
  //         options: ["", "", "", ""],
  //       })),
  //   notes: state?.notes || ["", ""],
  // });

  const isDuplicateQuestion = useCallback(
    (index, value) => {
      return questions.some(
        (q, i) => i !== index && q?.question?.trim() === value?.trim(),
      );
    },
    [questions],
  );

  const handleQueValidate = useCallback(
    (index) => {
      const question = questions[index];
      const errorObj = {
        questionError: "",
        answerError: "",
        optionsError: "",
      };

      if (!question?.question?.trim()) {
        errorObj.questionError = "Question cannot be empty";
      } else if (isDuplicateQuestion(index, question.question)) {
        errorObj.questionError = "Duplicate question not allowed";
      }

      if (!question?.options || !Array.isArray(question.options)) {
        errorObj.optionsError = "Invalid options format";
      } else {
        const hasEmptyOption = question.options.some((opt) => !opt?.trim());
        if (hasEmptyOption) {
          errorObj.optionsError = "4 options are required for each question";
        } else if (!uniqueOpt(question.options)) {
          errorObj.optionsError = "Same option not allowed";
        }
      }

      if (!question?.answer?.trim()) {
        errorObj.answerError = "Answer is required";
      }

      // setQuestionsError(errorObj);
      dispatch({
        type: "SET_ERROR",
        payload: { questionsError: errorObj },
      });
      return (
        !errorObj.questionError &&
        !errorObj.answerError &&
        !errorObj.optionsError
      );
    },
    [questions, isDuplicateQuestion],
  );

  const handleSubjectChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch({
        type: "SET_DATA",
        payload: {
          ...formData,
          formData: { ...formData.formData, subjectName: value },
        },
      });
      // setExamData((prev) => ({ ...prev, [name]: value }));
      let SubjectError = validate(value, name);
      // setError((prev) => ({
      //   ...prev,
      //   subjectError: error,
      // }));

      dispatch({
        type: "SET_ERROR",
        payload: { error: { ...errors.error, subjectError: SubjectError } },
      });
    },
    [errors.error, formData],
  );

  const handleQuestionChange = useCallback(
    (e) => {
      const value = e.target.value;
      const updatedQuestions = [...questions];
      updatedQuestions[currentQ].question = value;
      // setExamData((prev) => ({ ...prev, questions: updatedQuestions }));
      dispatch({
        type: "SET_DATA",
        payload: {
          ...formData,
          formData: { ...formData.formData, questions: updatedQuestions },
        },
      });

      let error = !value?.trim()
        ? "Question cannot be empty"
        : isDuplicateQuestion(currentQ || 0, value)
          ? "Duplicate question not allowed"
          : null;
      // setQuestionsError((prev) => ({ ...prev, questionError: error }));
      dispatch({
        type: "SET_ERROR",
        payload: {
          questionsError: { ...errors.questionError, questionError: error },
        },
      });
    },
    [questions, currentQ, formData, isDuplicateQuestion, errors.questionError],
  );

  const handleAnswerChange = useCallback(
    (e) => {
      const value = e.target.value;
      const updatedQuestions = [...questions];
      updatedQuestions[currentQ].answer = value;
      // setExamData((prev) => ({ ...prev, questions: updatedQuestions }));
      dispatch({
        type: "SET_DATA",
        payload: {
          ...formData,
          formData: { ...formData.formData, questions: updatedQuestions },
        },
      });
      let error = validate("Answer", value);
      // setQuestionsError((prev) => ({ ...prev, answerError: error }));
      dispatch({
        type: "SET_ERROR",
        payload: {
          questionsError: { ...errors.questionError, answerError: error },
        },
      });
    },
    [currentQ, errors.questionError, formData, questions],
  );

  const handelOptionChange = useCallback(
    (e, idx) => {
      const value = e.target.value;
      const updatedQuestions = [...questions];
      updatedQuestions[currentQ].options[idx] = value;
      updatedQuestions[currentQ].answer = "";
      // setExamData((prev) => ({ ...prev, questions: updatedQuestions }));
      dispatch({
        type: "SET_DATA",
        payload: {
          formData: { ...formData.formData, questions: updatedQuestions },
        },
      });
      let error = !value?.trim()
        ? "Option can not be empty"
        : !uniqueOpt(updatedQuestions[currentQ].options)
          ? "Same option not allowed"
          : null;
      // setQuestionsError((prev) => ({ ...prev, optionsError: error }));
      dispatch({
        type: "SET_ERROR",
        payload: {
          questionsError: { ...errors.questionError, optionsError: error },
        },
      });
    },
    [currentQ, errors.questionError, formData.formData, questions],
  );

  const handleNoteChange = useCallback(
    (e, idx) => {
      const value = e.target.value;
      const updatedNotes = [...notes];
      updatedNotes[idx] = value;
      // setExamData((prev) => ({ ...prev, notes: updatedNotes }));
      dispatch({
        type: "SET_DATA",
        payload: {
          formData: { ...formData.formData, notes: updatedNotes },
        },
      });
      let noteError = validate("Note", value);
      // setError((prev) => ({ ...prev, noteError: noteError }));
      dispatch({
        type: "SET_ERROR",
        payload: { error: { ...errors.error, noteError: noteError } },
      });
    },
    [errors.error, formData.formData, notes],
  );

  const handleQuestionSave = useCallback(
    (index, page) => {
      let allQue;
      if (handleQueValidate(index)) {
        allQue = errors.allQuestionError.map((val, arrIndex) =>
          arrIndex === index ? true : val,
        );
        // setAllQuestionError(allQue);
        dispatch({
          type: "SET_ERROR",
          payload: { allQuestionError: allQue },
        });
        page &&
          dispatch({
            type: "SET_DATA",
            payload: {
              currentQ: page === "previous" ? currentQ - 1 : currentQ + 1,
            },
          });
        // page &&
        //   setCurrentQuestion(page === "previous" ? currentQ - 1 : currentQ + 1);
      } else {
        allQue = errors.allQuestionError.map((val, arrIndex) =>
          arrIndex === index ? false : val,
        );
        // setAllQuestionError(allQue);
        dispatch({
          type: "SET_ERROR",
          payload: { allQuestionError: allQue },
        });
      }
      if (allQue) {
        // allQue.every((val) => val) && setError({ ...error, queError: null });
        allQue.every((val) => val) &&
          dispatch({
            type: "SET_ERROR",
            payload: { error: { ...errors.error, queError: null } },
          });
      }
      return allQue;
    },
    [errors.allQuestionError, currentQ, handleQueValidate],
  );

  const customValidation = () => {
    let result = handleQuestionSave(currentQ);
    const errorObj = {};
    if (subjectName?.trim()) {
      errorObj.subjectName = "Subject name is required";
    }
    const currentQ = questions[currentQ];
    if (!currentQ?.question?.trim()) {
      errorObj[`question-${currentQ}`] = "Question cannot be empty";
    } else if (isDuplicateQuestion(currentQ, currentQ.question)) {
      errorObj[`question-${currentQ}`] = "Duplicate question not allowed";
    }

    const hasEmptyOption = currentQ?.options?.some((opt) => !opt?.trim());
    if (hasEmptyOption) {
      errorObj[`option-${currentQ}-0`] =
        "4 options are required for each question";
    } else if (currentQ?.options && !uniqueOpt(currentQ.options)) {
      errorObj[`option-${currentQ}-0`] = "Same option not allowed";
    }

    if (!currentQ?.answer?.trim()) {
      errorObj[`answer-${currentQ}`] = "Answer is required";
    }

    if (!notes?.every((note) => note?.trim())) {
      errorObj.note0 = "Notes are required";
    } else if (notes[0]?.trim() === notes[1]?.trim()) {
      errorObj.note0 = "Notes can not be same";
    }
    if (!result.every((val) => val)) {
      errorObj.queError = "all 15  question are required";
    }

    if (Object.keys(errors).length > 0) {
      if (errorObj.subjectName) {
        // setError((prev) => ({ ...prev, subjectError: errors.subjectName }));
        dispatch({
          type: "SET_ERROR",
          payload: {
            error: { ...errors.error, subjectError: errorObj.subjectName },
          },
        });
      }
      // setQuestionsError({
      //   questionError: errors[`question-${currentQ}`] || "",
      //   optionsError: errors[`option-${currentQ}-0`] || "",
      //   answerError: errors[`answer-${currentQ}`] || "",
      // });
      dispatch({
        type: "SET_ERROR",
        payload: {
          questionsError: {
            questionError: errors[`question-${currentQ}`] || "",
            optionsError: errors[`option-${currentQ}-0`] || "",
            answerError: errors[`answer-${currentQ}`] || "",
          },
        },
      });
      if (errors.note0) {
        // setError((prev) => ({ ...prev, noteError: errors.note0 }));
        dispatch({
          type: "SET_ERROR",
          payload: {
            error: { ...errors.error, subjectError: errorObj.note0 },
          },
        });
      }
    }
    return errorObj;
  };

  const handleSubmit = () => {
    if (isUpdateForm) {
      dispatch(
        updateExam({ subjectName, questions, notes }, examId, token, navigate),
      );
    } else {
      dispatch(createExam({ subjectName, questions, notes }, token, navigate));
    }
  };

  const resetForm = () => {
    // setExamData({
    //   subjectName: "",
    //   questions: Array(TOTAL_QUESTIONS)
    //     .fill()
    //     .map(() => ({
    //       question: "",
    //       answer: "",
    //       options: ["", "", "", ""],
    //     })),
    //   notes: ["", ""],
    // });
    dispatch({
      type: "SET_DATA",
      payload: {
        formData: {
          subjectName: "",
          questions: Array(TOTAL_QUESTIONS)
            .fill()
            .map(() => ({
              question: "",
              answer: "",
              options: ["", "", "", ""],
            })),
          notes: ["", ""],
        },
      },
    });

    // setQuestionsError(questionsErrorObj);
    dispatch({
      type: "SET_ERROR",
      payload: { questionsError: questionsErrorObj },
    });
    // setAllQuestionError(Array(TOTAL_QUESTIONS).fill(false));
    dispatch({
      type: "SET_ERROR",
      payload: { allQuestionError: Array(TOTAL_QUESTIONS).fill(false) },
    });
    // setError(teacherErrorObj);
    dispatch({
      type: "SET_ERROR",
      payload: { error: {} },
    });
    // setCurrentQuestion(0);
    dispatch({
      type: "SET_DATA",
      payload: {
        ...formData,
        currentQ: 0,
      },
    });
  };

  useEffect(() => {
    if (questions) {
      // setAllQuestionError(Array(TOTAL_QUESTIONS).fill(true));
      dispatch({
        type: "SET_ERROR",
        payload: { allQuestionError: Array(TOTAL_QUESTIONS).fill(true) },
      });
    }
  }, [isUpdateForm, questions]);

  const formFields = useMemo(() => {
    const currentQuestion = questions[currentQ] || {
      question: "",
      answer: "",
      options: ["", "", "", ""],
    };
    return [
      {
        id: "subjectName",
        type: "text",
        name: "Subject Name",
        input: "input",
        placeholder: "Subject Name",
        value: subjectName,
        error: errors?.error?.subjectError,
        onChange: (e) => {
          handleSubjectChange(e);
        },
      },
      {
        id: `question-${currentQuestion}`,
        type: "text",
        name: `Question: ${currentQuestion + 1} / ${TOTAL_QUESTIONS}`,
        input: "input",
        placeholder: "Enter question",
        value: currentQuestion.question || "",
        error: errors.questionsError.questionError,
        onChange: (e) => {
          handleQuestionChange(e);
        },
      },
      ...(currentQuestion.options || []).map((opt, idx) => ({
        id: `option-${currentQuestion}-${idx}`,
        type: "text",
        name: `Options`,
        input: "input",
        placeholder: `Option ${idx + 1}`,
        value: opt || "",
        error: errors.questionsError.optionsError,
        noText: true,
        onChange: (e) => {
          handelOptionChange(e, idx);
        },
      })),
      {
        id: `answer-${currentQ}`,
        type: "radio",
        name: "Answer",
        noLabel: true,
        input: "radio",
        options:
          (currentQ.options || []).filter((opt) => opt?.trim() !== "") || [],
        value: currentQ.answer || "",
        error: errors.questionsError.answerError,
        onChange: (e) => {
          handleAnswerChange(e);
        },
        className: "radio-com",
      },
      {
        id: "previous",
        type: "button",
        name: "Previous",
        input: "button",
        noText: true,
        onClick: () => {
          handleQuestionSave(currentQuestion, "previous");
        },
        disabled: currentQuestion === 0,
      },
      {
        type: "button",
        noText: true,
        onClick: () => {
          handleQuestionSave(currentQuestion, "next");
        },
        disabled: currentQuestion === TOTAL_QUESTIONS - 1,
        name: "Next",
        input: "button",
        id: "next",
        className: "next-btn-div",
      },
      ...(notes || ["", ""]).map((note, idx) => ({
        id: `note-${idx}`,
        type: "text",
        name: `Notes`,
        input: "input",
        placeholder: `Note ${idx + 1}`,
        value: note || "",
        error: errors?.error?.noteError,
        noText: true,
        onChange: (e) => {
          handleNoteChange(e, idx);
        },
      })),
    ];
  }, [
    questions,
    subjectName,
    errors,
    notes,
    handleSubjectChange,
    handleQuestionChange,
    handelOptionChange,
    handleAnswerChange,
    handleQuestionSave,
    handleNoteChange,
  ]);

  return {
    customValidation,
    handleSubmit,
    resetForm,
    formData,
    formFields,
  };
};

export default TeacherFormValidate;
