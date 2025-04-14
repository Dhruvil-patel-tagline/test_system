import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  const isDuplicateQuestion = useCallback((index, value) => {
    return examData.questions.some(
      (q, i) => i !== index && q?.question?.trim() === value?.trim(),
    );
  }, []);

  const handleQueValidate = (index) => {
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
    return !errors.questionError && !errors.answerError && !errors.optionsError;
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
    let error = validate(value, name);
    setError((prev) => ({
      ...prev,
      subjectError: error,
    }));
  };

  const handleQuestionChange = useCallback((e) => {
    const value = e.target.value;
    const updatedQuestions = [...examData.questions];
    if (!updatedQuestions[currentQuestion]) {
      updatedQuestions[currentQuestion] = {
        question: "",
        answer: "",
        options: ["", "", "", ""],
      };
    }
    updatedQuestions[currentQuestion].question = value;
    setExamData((prev) => ({ ...prev, questions: updatedQuestions }));

    if (!value?.trim()) {
      setQuestionsError((prev) => ({
        ...prev,
        questionError: "Question cannot be empty",
      }));
    } else if (isDuplicateQuestion(currentQuestion, value)) {
      setQuestionsError((prev) => ({
        ...prev,
        questionError: "Duplicate question not allowed",
      }));
    } else {
      setQuestionsError((prev) => ({ ...prev, questionError: "" }));
    }
  }, []);

  const handleAnswerChange = useCallback((e) => {
    const value = e.target.value;
    const updatedQuestions = [...examData.questions];
    if (!updatedQuestions[currentQuestion]) {
      updatedQuestions[currentQuestion] = {
        question: "",
        answer: "",
        options: ["", "", "", ""],
      };
    }
    updatedQuestions[currentQuestion].answer = value;
    setExamData((prev) => ({ ...prev, questions: updatedQuestions }));

    if (value?.trim()) {
      setQuestionsError((prev) => ({ ...prev, answerError: "" }));
    } else {
      setQuestionsError((prev) => ({
        ...prev,
        answerError: "Answer is required",
      }));
    }
  }, []);

  const optionValidate = (value, currentQ, idx) => {
    if (!value?.trim()) {
      return "Option cannot be empty";
    }
    const hasDuplicate =
      currentQ.options.filter(
        (o, i) => i !== idx && o?.trim() === value?.trim(),
      ).length > 0;
    if (hasDuplicate) {
      return "Same option not allowed";
    }
    return null;
  };

  const handelOptionChange = useCallback((e, idx) => {
    const value = e.target.value;
    const updatedQuestions = [...examData.questions];
    if (!updatedQuestions[currentQuestion]) {
      updatedQuestions[currentQuestion] = {
        question: "",
        answer: "",
        options: ["", "", "", ""],
      };
    }
    updatedQuestions[currentQuestion].options[idx] = value;
    updatedQuestions[currentQuestion].answer = "";
    setExamData((prev) => ({ ...prev, questions: updatedQuestions }));

    if (!value?.trim()) {
      setQuestionsError((prev) => ({
        ...prev,
        optionsError: "Option cannot be empty",
      }));
    } else {
      const hasDuplicate =
        updatedQuestions[currentQuestion].options.filter(
          (opt, i) => i !== idx && opt?.trim() === value?.trim(),
        ).length > 0;
      if (hasDuplicate) {
        setQuestionsError((prev) => ({
          ...prev,
          optionsError: "Same option not allowed",
        }));
      } else {
        setQuestionsError((prev) => ({ ...prev, optionsError: "" }));
      }
    }
  }, []);

  const handleNoteChange = useCallback((e, idx) => {
    const value = e.target.value;
    const updatedNotes = [...examData.notes];
    updatedNotes[idx] = value;
    setExamData((prev) => ({ ...prev, notes: updatedNotes }));

    if (!value?.trim()) {
      setError((prev) => ({ ...prev, noteError: "Note is required" }));
    } else if (idx === 1 && value?.trim() === examData.notes[0]?.trim()) {
      setError((prev) => ({
        ...prev,
        noteError: "Notes can not be same",
      }));
    } else if (
      updatedNotes.every((note) => note?.trim()) &&
      updatedNotes[0]?.trim() !== updatedNotes[1]?.trim()
    ) {
      setError((prev) => ({ ...prev, noteError: null }));
    }
  }, []);

  const handleQuestionSave = useCallback((index, page) => {
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
  }, []);

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
    try {
      if (isUpdateForm) {
        dispatch(updateExam(examData, state?.examId, token, navigate));
      } else {
        dispatch(createExam(examData, token, navigate));
      }
    } catch (error) {
      toast.error("An error occurred while saving the exam");
      return Promise.reject(error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateForm]);

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
        validate: (value) => {
          validate(value, "Subject name");
        },
        onChange: (e) => {
          handleSubjectChange(e);
        },
        labelClassName: "teacherLabel",
        errorClassName: "teacherError",
      },
      {
        id: `question-${currentQuestion}`,
        type: "text",
        name: `Question ${currentQuestion + 1}`,
        input: "input",
        placeholder: "Enter question",
        value: currentQ.question || "",
        error: questionsError.questionError,
        validate: (value) => {
          if (!value?.trim()) {
            return "Question cannot be empty";
          }
          if (isDuplicateQuestion(currentQuestion, value)) {
            return "Duplicate question not allowed";
          }
          return null;
        },
        onChange: (e) => {
          handleQuestionChange(e);
        },
        labelClassName: "teacherLabel",
        errorClassName: "teacherError",
      },
      ...(currentQ.options || []).map((opt, idx) => ({
        id: `option-${currentQuestion}-${idx}`,
        type: "text",
        name: `Option ${idx + 1}`,
        input: "input",
        placeholder: `Option ${idx + 1}`,
        value: opt || "",
        error: questionsError.optionsError,
        NoLabel: true,
        validate: (value) => {
          optionValidate(value, currentQ, idx);
        },
        onChange: (e) => {
          handelOptionChange(e, idx);
        },
        labelClassName: "teacherLabel",
        errorClassName: "teacherError",
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
        validate: (value) => {
          validate(value, "Answer");
        },
        onChange: (e) => {
          handleAnswerChange(e);
        },
        labelClassName: "teacherLabel",
        errorClassName: "teacherError",
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
      },
      ...(examData.notes || ["", ""]).map((note, idx) => ({
        id: `note-${idx}`,
        type: "text",
        name: `Note ${idx + 1}`,
        input: "input",
        placeholder: `Note ${idx + 1}`,
        value: note || "",
        error: error.noteError,
        NoLabel: true,
        validate: (value) => {
          if (!value?.trim()) {
            return "Note is required";
          }
          if (idx === 1 && value?.trim() === examData.notes[0]?.trim()) {
            return "Notes can not be same";
          }
          return null;
        },
        onChange: (e) => {
          handleNoteChange(e, idx);
        },
        labelClassName: "teacherLabel",
        errorClassName: "teacherError",
      })),
    ];
  }, [
    examData,
    currentQuestion,
    error,
    questionsError,
    isDuplicateQuestion,
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
