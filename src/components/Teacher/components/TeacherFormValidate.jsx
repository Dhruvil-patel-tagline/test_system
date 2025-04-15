import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createExam, updateExam } from "../../../redux/action/examActions";
import { getCookie } from "../../../utils/getCookie";
import {
  questionsErrorObj,
  teacherErrorObj,
  TOTAL_QUESTIONS,
} from "../../../utils/staticObj";
import validate, { uniqueOpt } from "../../../utils/validate";

const TeacherFormValidate = ({ isUpdateForm, state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getCookie("authToken");
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

  const isDuplicateQuestion = useCallback(
    (index, value) => {
      return examData.questions.some(
        (q, i) => i !== index && q?.question?.trim() === value?.trim(),
      );
    },
    [examData.questions],
  );

  const handleQueValidate = useCallback(
    (index) => {
      const question = examData.questions[index];
      const errors = {
        questionError: "",
        answerError: "",
        optionsError: "",
      };

      if (!question?.question?.trim()) {
        errors.questionError = "Question cannot be empty";
      } else if (isDuplicateQuestion(index, question.question)) {
        errors.questionError = "Duplicate question not allowed";
      }

      if (!question?.options || !Array.isArray(question.options)) {
        errors.optionsError = "Invalid options format";
      } else {
        const hasEmptyOption = question.options.some((opt) => !opt?.trim());
        if (hasEmptyOption) {
          errors.optionsError = "4 options are required for each question";
        } else if (!uniqueOpt(question.options)) {
          errors.optionsError = "Same option not allowed";
        }
      }

      if (!question?.answer?.trim()) {
        errors.answerError = "Answer is required";
      }

      setQuestionsError(errors);
      return (
        !errors.questionError && !errors.answerError && !errors.optionsError
      );
    },
    [examData.questions, isDuplicateQuestion],
  );

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
    let error = validate(value, name);
    setError((prev) => ({
      ...prev,
      subjectError: error,
    }));
  };

  const handleQuestionChange = useCallback(
    (e) => {
      const value = e.target.value;
      const updatedQuestions = [...examData.questions];
      updatedQuestions[currentQuestion].question = value;
      setExamData((prev) => ({ ...prev, questions: updatedQuestions }));
      let error = !value?.trim()
        ? "Question cannot be empty"
        : isDuplicateQuestion(currentQuestion, value)
          ? "Duplicate question not allowed"
          : null;
      setQuestionsError((prev) => ({ ...prev, questionError: error }));
    },
    [currentQuestion, examData.questions, isDuplicateQuestion],
  );

  const handleAnswerChange = useCallback(
    (e) => {
      const value = e.target.value;
      const updatedQuestions = [...examData.questions];
      updatedQuestions[currentQuestion].answer = value;
      setExamData((prev) => ({ ...prev, questions: updatedQuestions }));
      let error = validate("Answer", value);
      setQuestionsError((prev) => ({ ...prev, answerError: error }));
    },
    [currentQuestion, examData.questions],
  );

  const handelOptionChange = useCallback(
    (e, idx) => {
      const value = e.target.value;
      const updatedQuestions = [...examData.questions];

      updatedQuestions[currentQuestion].options[idx] = value;
      updatedQuestions[currentQuestion].answer = "";
      setExamData((prev) => ({ ...prev, questions: updatedQuestions }));
      let error = !value?.trim()
        ? "Option can not be empty"
        : !uniqueOpt(updatedQuestions[currentQuestion].options)
          ? "Same option not allowed"
          : null;
      setQuestionsError((prev) => ({ ...prev, optionsError: error }));
    },
    [currentQuestion, examData.questions],
  );

  const handleNoteChange = useCallback(
    (e, idx) => {
      const value = e.target.value;
      const updatedNotes = [...examData.notes];
      updatedNotes[idx] = value;
      setExamData((prev) => ({ ...prev, notes: updatedNotes }));
      let error = validate("Note", value);
      setError((prev) => ({ ...prev, noteError: error }));
    },
    [examData.notes],
  );

  const handleQuestionSave = useCallback(
    (index, page) => {
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
    },
    [allQuestionError, currentQuestion, error, handleQueValidate],
  );

  const customValidation = () => {
    let result = handleQuestionSave(currentQuestion);
    const errors = {};
    if (!examData.subjectName?.trim()) {
      errors.subjectName = "Subject name is required";
    }
    const currentQ = examData.questions[currentQuestion];
    if (!currentQ?.question?.trim()) {
      errors[`question-${currentQuestion}`] = "Question cannot be empty";
    } else if (isDuplicateQuestion(currentQuestion, currentQ.question)) {
      errors[`question-${currentQuestion}`] = "Duplicate question not allowed";
    }

    const hasEmptyOption = currentQ?.options?.some((opt) => !opt?.trim());
    if (hasEmptyOption) {
      errors[`option-${currentQuestion}-0`] =
        "4 options are required for each question";
    } else if (currentQ?.options && !uniqueOpt(currentQ.options)) {
      errors[`option-${currentQuestion}-0`] = "Same option not allowed";
    }

    if (!currentQ?.answer?.trim()) {
      errors[`answer-${currentQuestion}`] = "Answer is required";
    }

    if (!examData.notes?.every((note) => note?.trim())) {
      errors.note0 = "Notes are required";
    } else if (examData.notes[0]?.trim() === examData.notes[1]?.trim()) {
      errors.note0 = "Notes can not be same";
    }
    if (!result.every((val) => val)) {
      errors.queError = "all 15  question are required";
    }

    if (Object.keys(errors).length > 0) {
      if (errors.subjectName) {
        setError((prev) => ({ ...prev, subjectError: errors.subjectName }));
      }
      setQuestionsError({
        questionError: errors[`question-${currentQuestion}`] || "",
        optionsError: errors[`option-${currentQuestion}-0`] || "",
        answerError: errors[`answer-${currentQuestion}`] || "",
      });
      if (errors.note0) {
        setError((prev) => ({ ...prev, noteError: errors.note0 }));
      }
    }
    return errors;
  };

  const handleSubmit = () => {
    if (isUpdateForm) {
      dispatch(updateExam(examData, state?.examId, token, navigate));
    } else {
      dispatch(createExam(examData, token, navigate));
    }
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
    setCurrentQuestion(0);
  };

  useEffect(() => {
    if (state?.questions) {
      setAllQuestionError(Array(TOTAL_QUESTIONS).fill(true));
    }
  }, [isUpdateForm, state?.questions]);

  const formFields = useMemo(() => {
    const currentQ = examData.questions[currentQuestion] || {
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
        value: examData.subjectName || "",
        error: error.subjectError,
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
        value: currentQ.question || "",
        error: questionsError.questionError,
        onChange: (e) => {
          handleQuestionChange(e);
        },
      },
      ...(currentQ.options || []).map((opt, idx) => ({
        id: `option-${currentQuestion}-${idx}`,
        type: "text",
        name: `Options`,
        input: "input",
        placeholder: `Option ${idx + 1}`,
        value: opt || "",
        error: questionsError.optionsError,
        NoLabel: true,
        onChange: (e) => {
          handelOptionChange(e, idx);
        },
      })),
      {
        id: `answer-${currentQuestion}`,
        type: "radio",
        name: "Answer",
        input: "radio",
        options:
          (currentQ.options || []).filter((opt) => opt?.trim() !== "") || [],
        value: currentQ.answer || "",
        error: questionsError.answerError,
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
        NoLabel: true,
        onClick: () => {
          handleQuestionSave(currentQuestion, "previous");
        },
        disabled: currentQuestion === 0,
      },
      {
        type: "button",
        NoLabel: true,
        onClick: () => {
          handleQuestionSave(currentQuestion, "next");
        },
        disabled: currentQuestion === TOTAL_QUESTIONS - 1,
        name: "Next",
        input: "button",
        id: "next",
        className: "next-btn-div",
      },
      ...(examData.notes || ["", ""]).map((note, idx) => ({
        id: `note-${idx}`,
        type: "text",
        name: `Notes`,
        input: "input",
        placeholder: `Note ${idx + 1}`,
        value: note || "",
        error: error.noteError,
        NoLabel: true,
        onChange: (e) => {
          handleNoteChange(e, idx);
        },
      })),
    ];
  }, [
    examData,
    currentQuestion,
    error,
    questionsError,
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
    examData,
    formFields,
  };
};

export default TeacherFormValidate;
