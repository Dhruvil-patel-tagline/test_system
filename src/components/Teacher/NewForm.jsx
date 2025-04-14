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

    // Handle subject change
    const handleSubjectChange = (e) => {
        const value = e.target.value;
        setExamData({ ...examData, subjectName: value });
        if (value?.trim()) {
            setError(prev => ({ ...prev, subjectError: null }));
        } else {
            setError(prev => ({ ...prev, subjectError: "Subject name is required" }));
        }
    };

    const handleNoteChange = (index, value) => {
        const updatedNotes = [...examData.notes];
        updatedNotes[index] = value;
        setExamData({ ...examData, notes: updatedNotes });

        if (error.noteError || value?.trim()) {
            let notesError = null;
            if (!updatedNotes.every((note) => note?.trim())) {
                notesError = "Notes are required";
            } else if (updatedNotes[0]?.trim() === updatedNotes[1]?.trim()) {
                notesError = "Notes can not be same";
            }
            setError(prev => ({ ...prev, noteError: notesError }));
        }
    };

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
            const hasEmptyOption = question.options.some(opt => !opt?.trim());
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

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...examData.questions];
        if (!updatedQuestions[index]) {
            updatedQuestions[index] = {
                question: "",
                answer: "",
                options: ["", "", "", ""]
            };
        }
        updatedQuestions[index].question = value;
        setExamData({ ...examData, questions: updatedQuestions });

        if (questionsError.questionError || value?.trim()) {
            const errors = { ...questionsError };
            if (!value?.trim()) {
                errors.questionError = "Question cannot be empty";
            } else if (isDuplicateQuestion(index, value)) {
                errors.questionError = "Duplicate question not allowed";
            } else {
                errors.questionError = "";
            }
            setQuestionsError(errors);
        }
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...examData.questions];
        if (!updatedQuestions[qIndex]) {
            updatedQuestions[qIndex] = {
                question: "",
                answer: "",
                options: ["", "", "", ""]
            };
        }
        updatedQuestions[qIndex].options[optIndex] = value;
        updatedQuestions[qIndex].answer = ""; 

        setExamData({ ...examData, questions: updatedQuestions });

        if (questionsError.optionsError || value?.trim()) {
            const errors = { ...questionsError };
            if (!value?.trim()) {
                errors.optionsError = "Option cannot be empty";
            } else if (updatedQuestions[qIndex].options.filter((opt, i) => i !== optIndex && opt?.trim() === value?.trim()).length > 0) {
                errors.optionsError = "Same option not allowed";
            } else {
                errors.optionsError = "";
            }
            setQuestionsError(errors);
        }
    };

    const handleAnswerChange = (index, value) => {
        const updatedQuestions = [...examData.questions];
        if (!updatedQuestions[index]) {
            updatedQuestions[index] = {
                question: "",
                answer: "",
                options: ["", "", "", ""]
            };
        }
        updatedQuestions[index].answer = value;
        setExamData({ ...examData, questions: updatedQuestions });

        if (questionsError.answerError || value?.trim()) {
            const errors = { ...questionsError };
            if (!value?.trim()) {
                errors.answerError = "Answer is required";
            } else {
                errors.answerError = "";
            }
            setQuestionsError(errors);
        }
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

    const customValidation = (formData) => {
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

        const hasEmptyOption = currentQ?.options?.some(opt => !opt?.trim());
        if (hasEmptyOption) {
            errors[`option-${currentQuestion}-0`] = "4 options are required for each question";
        } else if (currentQ?.options && !uniqueOpt(currentQ.options)) {
            errors[`option-${currentQuestion}-0`] = "Same option not allowed";
        }

        if (!currentQ?.answer?.trim()) {
            errors[`answer-${currentQuestion}`] = "Answer is required";
        }

        if (!examData.notes?.every(note => note?.trim())) {
            errors.note0 = "Notes are required";
            errors.note1 = "Notes are required";
        } else if (examData.notes[0]?.trim() === examData.notes[1]?.trim()) {
            errors.note0 = "Notes can not be same";
            errors.note1 = "Notes can not be same";
        }

        if (Object.keys(errors).length > 0) {
            if (errors.subjectName) {
                setError(prev => ({ ...prev, subjectError: errors.subjectName }));
            }

            setQuestionsError({
                questionError: errors[`question-${currentQuestion}`] || "",
                optionsError: errors[`option-${currentQuestion}-0`] || "",
                answerError: errors[`answer-${currentQuestion}`] || ""
            });

            if (errors.note0) {
                setError(prev => ({ ...prev, noteError: errors.note0 }));
            }
        }

        return errors;
    };

    const handleSubmit =  (formData, setFormData, setErrors) => {
        setIsSubmitting(true);

        try {
            if (isUpdateForm) {
                 dispatch(updateExam(examData, state?.examId, token, navigate));
            } else {
                 dispatch(createExam(examData, token, navigate));
            }
        } catch (error) {
            toast.error("An error occurred while saving the exam");
        } finally {
            setIsSubmitting(false);
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
    }, [isUpdateForm]);

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

    const prepareFormFields = () => {
        const currentQ = examData.questions[currentQuestion] || {
            question: "",
            answer: "",
            options: ["", "", "", ""]
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
                    if (!value?.trim()) {
                        return "Subject name is required";
                    }
                    return null;
                },
                onChange: (e) => {
                    const value = e.target.value;
                    setExamData(prev => ({ ...prev, subjectName: value }));
                    if (value?.trim()) {
                        setError(prev => ({ ...prev, subjectError: null }));
                    } else {
                        setError(prev => ({ ...prev, subjectError: "Subject name is required" }));
                    }
                },
                labelClassName: "teacherLabel",
                errorClassName: "teacherError"
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
                    const value = e.target.value;
                    const updatedQuestions = [...examData.questions];
                    if (!updatedQuestions[currentQuestion]) {
                        updatedQuestions[currentQuestion] = {
                            question: "",
                            answer: "",
                            options: ["", "", "", ""]
                        };
                    }
                    updatedQuestions[currentQuestion].question = value;
                    setExamData(prev => ({ ...prev, questions: updatedQuestions }));

                    // Validate and update error
                    if (!value?.trim()) {
                        setQuestionsError(prev => ({ ...prev, questionError: "Question cannot be empty" }));
                    } else if (isDuplicateQuestion(currentQuestion, value)) {
                        setQuestionsError(prev => ({ ...prev, questionError: "Duplicate question not allowed" }));
                    } else {
                        setQuestionsError(prev => ({ ...prev, questionError: "" }));
                    }
                },
                labelClassName: "teacherLabel",
                errorClassName: "teacherError"
            },
            ...(currentQ.options || []).map((opt, idx) => ({
                id: `option-${currentQuestion}-${idx}`,
                type: "text",
                name: `Option ${idx + 1}`,
                input: "input",
                placeholder: `Option ${idx + 1}`,
                value: opt || "",
                error: questionsError.optionsError,
                validate: (value) => {
                    if (!value?.trim()) {
                        return "Option cannot be empty";
                    }
                    const hasDuplicate = currentQ.options.filter((o, i) => i !== idx && o?.trim() === value?.trim()).length > 0;
                    if (hasDuplicate) {
                        return "Same option not allowed";
                    }
                    return null;
                },
                onChange: (e) => {
                    const value = e.target.value;
                    const updatedQuestions = [...examData.questions];
                    if (!updatedQuestions[currentQuestion]) {
                        updatedQuestions[currentQuestion] = {
                            question: "",
                            answer: "",
                            options: ["", "", "", ""]
                        };
                    }
                    updatedQuestions[currentQuestion].options[idx] = value;
                    updatedQuestions[currentQuestion].answer = ""; // Reset answer when options change
                    setExamData(prev => ({ ...prev, questions: updatedQuestions }));

                    // Validate and update error
                    if (!value?.trim()) {
                        setQuestionsError(prev => ({ ...prev, optionsError: "Option cannot be empty" }));
                    } else {
                        const hasDuplicate = updatedQuestions[currentQuestion].options
                            .filter((opt, i) => i !== idx && opt?.trim() === value?.trim())
                            .length > 0;

                        if (hasDuplicate) {
                            setQuestionsError(prev => ({ ...prev, optionsError: "Same option not allowed" }));
                        } else {
                            setQuestionsError(prev => ({ ...prev, optionsError: "" }));
                        }
                    }
                },
                labelClassName: "teacherLabel",
                errorClassName: "teacherError"
            })),
            {
                id: `answer-${currentQuestion}`,
                type: "radio",
                name: "Answer",
                input: "radio",
                options: (currentQ.options || []).filter(opt => opt?.trim() !== "") || [],
                value: currentQ.answer || "",
                error: questionsError.answerError,
                validate: (value) => {
                    if (!value?.trim()) {
                        return "Answer is required";
                    }
                    return null;
                },
                onChange: (e) => {
                    const value = e.target.value;
                    const updatedQuestions = [...examData.questions];
                    if (!updatedQuestions[currentQuestion]) {
                        updatedQuestions[currentQuestion] = {
                            question: "",
                            answer: "",
                            options: ["", "", "", ""]
                        };
                    }
                    updatedQuestions[currentQuestion].answer = value;
                    setExamData(prev => ({ ...prev, questions: updatedQuestions }));

                    if (value?.trim()) {
                        setQuestionsError(prev => ({ ...prev, answerError: "" }));
                    } else {
                        setQuestionsError(prev => ({ ...prev, answerError: "Answer is required" }));
                    }
                },
                labelClassName: "teacherLabel",
                errorClassName: "teacherError"
            },
            ...(examData.notes || ["", ""]).map((note, idx) => ({
                id: `note-${idx}`,
                type: "text",
                name: `Note ${idx + 1}`,
                input: "input",
                placeholder: `Note ${idx + 1}`,
                value: note || "",
                error: error.noteError,
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
                    const value = e.target.value;
                    const updatedNotes = [...examData.notes];
                    updatedNotes[idx] = value;
                    setExamData(prev => ({ ...prev, notes: updatedNotes }));

                    if (!value?.trim()) {
                        setError(prev => ({ ...prev, noteError: "Note is required" }));
                    } else if (idx === 1 && value?.trim() === examData.notes[0]?.trim()) {
                        setError(prev => ({ ...prev, noteError: "Notes can not be same" }));
                    } else if (updatedNotes.every(note => note?.trim()) &&
                        updatedNotes[0]?.trim() !== updatedNotes[1]?.trim()) {
                        setError(prev => ({ ...prev, noteError: null }));
                    }
                },
                labelClassName: "teacherLabel",
                errorClassName: "teacherError"
            }))
        ];
    };

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
                        customValidation={customValidation}
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
