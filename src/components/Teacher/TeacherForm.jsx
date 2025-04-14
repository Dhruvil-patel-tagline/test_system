/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createExam, updateExam } from "../../redux/action/examActions";
import FormCom from "../../shared/FormCom";
import Loader from "../../shared/Loader";
import { getCookie } from "../../utils/getCookie";
import {
  questionsErrorObj,
  teacherErrorObj,
  TOTAL_QUESTIONS,
  ExamFields,
} from "../../utils/staticObj";
import validate, { uniqueOpt } from "../../utils/validate";
import "./css/teacher.css";

const NewForm = () => {
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

  // Check if a question is a duplicate
  const isDuplicateQuestion = (index, value) => {
    return examData.questions.some(
      (q, i) => i !== index && q?.question?.trim() === value?.trim(),
    );
  };

  // Validate a question
  const handleQueValidate = (index) => {
    const errors = {};
    errors.optionsError = "";
    const updatedQuestions = [...examData.questions];
    const value = updatedQuestions[index];

    if (!value.question.trim()) {
      errors.questionError = "Question cannot be empty";
    } else if (isDuplicateQuestion(index, value?.question)) {
      errors.questionError = "Duplicate question not allowed";
    } else {
      errors.questionError = "";
    }

    if (!value.answer.trim()) {
      errors.answerError = "Answer is required";
    } else {
      errors.answerError = "";
    }

    const hasEmptyOption = value.options.some(opt => !opt.trim());
    if (hasEmptyOption) {
      errors.optionsError = "4 options are required for each question";
    } else if (!uniqueOpt(value.options)) {
      errors.optionsError = "Same option not allowed";
    } else {
      errors.optionsError = "";
    }

    setQuestionsError(errors);

    return !errors.questionError && !errors.answerError && !errors.optionsError;
  };

  // Save a question and navigate
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

  // Handle subject change
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setExamData({ ...examData, subjectName: value });
    const subjectError = validate("Subject name", value);
    setError({ ...error, subjectError });
  };

  // Handle note change
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

  // Validate the entire form
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

  // Handle form submission
  const handleSubmit = async (formData, setFormData, setErrors) => {
    let hasErrors = false;

    // Validate subject name
    const subjectError = validate("Subject name", examData.subjectName);
    if (subjectError) {
      setError(prev => ({ ...prev, subjectError }));
      hasErrors = true;
    }

    // Validate all questions
    const allQuestionsValid = Array(TOTAL_QUESTIONS).fill(false).map((_, index) => {
      const question = examData.questions[index];

      // Validate question text
      if (!question.question.trim()) {
        if (index === currentQuestion) {
          setQuestionsError(prev => ({ ...prev, questionError: "Question cannot be empty" }));
        }
        return false;
      }

      // Validate duplicate questions
      if (isDuplicateQuestion(index, question.question)) {
        if (index === currentQuestion) {
          setQuestionsError(prev => ({ ...prev, questionError: "Duplicate question not allowed" }));
        }
        return false;
      }

      // Validate options
      const hasEmptyOption = question.options.some(opt => !opt.trim());
      if (hasEmptyOption) {
        if (index === currentQuestion) {
          setQuestionsError(prev => ({ ...prev, optionsError: "4 options are required for each question" }));
        }
        return false;
      }

      if (!uniqueOpt(question.options)) {
        if (index === currentQuestion) {
          setQuestionsError(prev => ({ ...prev, optionsError: "Same option not allowed" }));
        }
        return false;
      }

      // Validate answer
      if (!question.answer.trim()) {
        if (index === currentQuestion) {
          setQuestionsError(prev => ({ ...prev, answerError: "Answer is required" }));
        }
        return false;
      }

      return true;
    });

    // Update question validation status
    setAllQuestionError(allQuestionsValid);

    // Check if all questions are valid
    if (!allQuestionsValid.every(isValid => isValid)) {
      setError(prev => ({ ...prev, queError: "Please fill out all the questions" }));
      toast.error("Please fill out all the questions");
      hasErrors = true;
    }

    // Validate notes
    if (!examData.notes.every(note => note.trim())) {
      setError(prev => ({ ...prev, noteError: "Notes are required" }));
      hasErrors = true;
    } else if (examData.notes[0].trim() === examData.notes[1].trim()) {
      setError(prev => ({ ...prev, noteError: "Notes can not be same" }));
      hasErrors = true;
    }

    // Return if any validation fails
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    if (isUpdateForm) {
      dispatch(updateExam(examData, state?.examId, token, navigate));
    } else {
      dispatch(createExam(examData, token, navigate));
    }
  };

  // Reset the form
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

  // Set all questions as valid if updating
  useEffect(() => {
    if (state?.questions) {
      setAllQuestionError(Array(TOTAL_QUESTIONS).fill(true));
    }
  }, [isUpdateForm]);

  // Show error if updating without questions
  if (isUpdateForm) {
    if (!state?.questions) {
      return (
        <div className="teacherFormErrorContainer">
          <p style={{ paddingTop: "70px", marginBottom: "10px" }}>
            Error occurred
          </p>
          <button type="button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      );
    }
  }

  // Prepare form fields for FormCom
  const prepareFormFields = () => {
    // Create subject field with validation
    const subjectField = {
      id: "subjectName",
      type: "text",
      name: "Subject Name",
      input: "input",
      placeholder: "Subject Name",
      value: examData.subjectName,
      onChange: handleSubjectChange,
      error: error.subjectError,
    };

    // Create a custom field for the current question
    const questionField = {
      id: `question-${currentQuestion}`,
      type: "text",
      name: `Question ${currentQuestion + 1}`,
      input: "input",
      placeholder: "Enter question",
      value: examData.questions[currentQuestion].question,
      onChange: (e) => {
        const value = e.target.value;
        const updatedQuestions = [...examData.questions];
        updatedQuestions[currentQuestion] = {
          ...updatedQuestions[currentQuestion],
          question: value,
        };
        setExamData({ ...examData, questions: updatedQuestions });

        if (!value.trim()) {
          setQuestionsError(prev => ({ ...prev, questionError: "Question cannot be empty" }));
        } else if (isDuplicateQuestion(currentQuestion, value)) {
          setQuestionsError(prev => ({ ...prev, questionError: "Duplicate question not allowed" }));
        } else {
          setQuestionsError(prev => ({ ...prev, questionError: "" }));
        }
      },
      error: questionsError.questionError,
    };

    // Create fields for options
    const optionFields = examData.questions[currentQuestion].options.map((opt, idx) => ({
      id: `option-${currentQuestion}-${idx}`,
      type: "text",
      name: `Option ${idx + 1}`,
      input: "input",
      placeholder: `Option ${idx + 1}`,
      value: opt,
      onChange: (e) => {
        const value = e.target.value;
        const updatedQuestions = [...examData.questions];
        updatedQuestions[currentQuestion].options[idx] = value;

        if (!uniqueOpt(updatedQuestions[currentQuestion].options)) {
          setQuestionsError(prev => ({
            ...prev,
            optionsError: "Same option not allowed",
          }));
        } else {
          const hasEmptyOption = updatedQuestions[currentQuestion].options.some(opt => !opt.trim());
          if (hasEmptyOption) {
            setQuestionsError(prev => ({
              ...prev,
              optionsError: "4 options are required for each question",
            }));
          } else {
            setQuestionsError(prev => ({ ...prev, optionsError: "" }));
          }
        }

        updatedQuestions[currentQuestion].answer = "";
        setExamData({ ...examData, questions: updatedQuestions });
      },
      error: idx === 0 ? questionsError.optionsError : null, // Show error only on first option
    }));

    // Create fields for answer radio buttons
    const answerField = {
      id: `answer-${currentQuestion}`,
      type: "radio",
      name: "Answer",
      input: "radio",
      options: examData.questions[currentQuestion].options.filter(opt => opt.trim() !== ""),
      value: examData.questions[currentQuestion].answer,
      onChange: (e) => {
        const value = e.target.value;
        const updatedQuestions = [...examData.questions];
        updatedQuestions[currentQuestion].answer = value;
        setQuestionsError(prev => ({
          ...prev,
          answerError: value ? "" : "Answer is required",
        }));
        setExamData({ ...examData, questions: updatedQuestions });
      },
      error: questionsError.answerError,
    };

    // Create fields for notes
    const noteFields = examData.notes.map((note, idx) => ({
      id: `note-${idx}`,
      type: "text",
      name: `Note ${idx + 1}`,
      input: "input",
      placeholder: `Note ${idx + 1}`,
      value: note,
      onChange: (e) => {
        const value = e.target.value;
        const updatedNotes = [...examData.notes];
        updatedNotes[idx] = value;

        if (!updatedNotes.every(note => note.trim())) {
          setError(prev => ({ ...prev, noteError: "Notes are required" }));
        } else if (updatedNotes[0].trim() === updatedNotes[1].trim()) {
          setError(prev => ({ ...prev, noteError: "Notes can not be same" }));
        } else {
          setError(prev => ({ ...prev, noteError: "" }));
        }

        setExamData({ ...examData, notes: updatedNotes });
      },
      error: error.noteError,
    }));

    return [
      subjectField,
      questionField,
      ...optionFields,
      answerField,
      ...noteFields,
    ];
  };

  // Prepare navigation buttons
  const navigationButtons = {
    previous: {
      text: "Previous",
      onClick: () => handleQuestionSave(currentQuestion, "previous"),
      disabled: currentQuestion === 0,
    },
    next: {
      text: "Next",
      onClick: () => handleQuestionSave(currentQuestion, "next"),
      disabled: currentQuestion === TOTAL_QUESTIONS - 1,
    },
  };

  return (
    <div>
      <div style={{ paddingTop: "20px" }}>
        {exams?.loading && <Loader />}
        <h1 className="teacherFormHeading">
          {isUpdateForm ? "Edit Exam" : "Create Exam"}
        </h1>
        <div className="teacherFormInner">
          <FormCom
            fields={prepareFormFields()}
            initialValues={examData}
            onSubmit={handleSubmit}
            buttonText={isUpdateForm ? "Update" : "Submit"}
            secondaryButton={{
              text: "Cancel",
              onClick: resetForm,
              color: "red",
            }}
          />

          <div className="btnGroup">
            <button
              type="button"
              disabled={currentQuestion === 0}
              onClick={() => handleQuestionSave(currentQuestion, "previous")}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentQuestion === TOTAL_QUESTIONS - 1}
              onClick={() => handleQuestionSave(currentQuestion, "next")}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewForm;
