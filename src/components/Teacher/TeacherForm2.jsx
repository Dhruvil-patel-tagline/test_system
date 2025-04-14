import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DynamicForm from "../../shared/DynamicForm";
const TOTAL_QUESTIONS = 15;

const TeacherForm2 = () => {
  const exams = useSelector((state) => state.exams);
  const { state, pathname } = useLocation();
  const isUpdateForm = pathname.includes("updateExam");
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
    notes: JSON.stringify(state?.notes) || "",
  });

  const formFields = () => {
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
      },
      {
        id: `question-${currentQuestion}`,
        type: "text",
        name: `Question ${currentQuestion + 1} `,
        input: "input",
        placeholder: "Enter question",
      },
      ...(currentQ.options || ["", "", "", ""]).map((opt, idx) => ({
        id: `option-${currentQuestion}-${idx}`,
        type: "text",
        name: `Option ${idx + 1}`,
        input: "input",
        placeholder: `Option ${idx + 1}`,
        value: opt || "",
        NoLabel: true,
      })),
      {
        id: `answer-${currentQuestion}`,
        type: "text",
        name: "Answer",
        input: "input",
        placeholder: "Enter Answer",
      },
      {
        type: "button",
        onClick: () => {
          setCurrentQuestion(currentQuestion - 1);
        },
        disabled: currentQuestion === 0,
        name: "Previous",
        input: "button",
        NoLabel: true,
        id: "previous",
      },
      {
        type: "button",
        NoLabel: true,
        onClick: () => {
          setCurrentQuestion(currentQuestion + 1);
        },
        disabled: currentQuestion === TOTAL_QUESTIONS - 1,
        name: "Next",
        input: "button",
        id: "next",
      },
      {
        id: `notes`,
        type: "text",
        name: `Note`,
        input: "input",
        placeholder: `Enter Notes`,
        value: "",
      },
    ];
  };

  const handleSubmit = (data, fun, fun2) => {
  };

  return (
    <div>
      <DynamicForm
        fields={formFields()}
        initialValues={examData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TeacherForm2;
