export const errorObj = {
  email: null,
  password: null,
};

export const userObj = {
  email: "",
  password: "",
};

export const dropObj = [
  { text: "Select role", value: "" },
  { text: "Teacher", value: "teacher" },
  { text: "Student", value: "student" },
];

export const teacherNavObj = [
  { to: "dashboard", text: "Dashboard" },
  { to: "students", text: "Student" },
  { to: "profile", text: "Profile" },
];

export const studentNavObj = [
  { to: "dashboard", text: "Dashboard" },
  { to: "profile", text: "Profile" },
];

export const signUpUserObj = {
  name: "",
  email: "",
  password: "",
  role: "",
};

export const allStudentHeader = ["Index", "Name", "Email", "Status", "Action"];
export const studentTableHeader = ["Index", "Subject", "Score", "Rank"];
export const examListHeader = [
  "Subject",
  "Email",
  "Notes",
  "View Exam",
  "Delete Exam",
];
export const examFormHeader = ["Index", "Question", "Answer", "Action"];
export const studentDashboardHeader = [
  "Index",
  "Subject",
  "Email",
  "Notes",
  "Action",
];
export const studentResultHeader = ["Index", "Subject", "Score", "Rank"];
export const examDetailHeader = ["Index", "Question", "Answer", "Action"];

export const questionsErrorObj = {
  questionError: "",
  answerError: "",
  optionsError: "",
};
export const teacherErrorObj = {
  subjectError: "",
  queError: "",
  noteError: "",
};
export const TOTAL_QUESTIONS = 15;

export const resetPasswordObj = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
export const resetPasswordErrorObj = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

export const inputs = [
  { id: "oldPassword", placeHolder: "Old Password" },
  { id: "password", placeHolder: "New Password" },
  { id: "confirmPassword", placeHolder: "Confirm Password" },
];

export const fields = [
  {
    id: "name",
    type: "text",
    name: "Name",
    input: "input",
    placeholder: "Enter your name",
  },
  {
    id: "email",
    type: "text",
    name: "Email",
    input: "input",
    placeholder: "Enter your email",
  },
  {
    id: "password",
    type: "password",
    name: "Password",
    input: "password",
    placeholder: "Enter your password",
  },
  { id: "role", name: "Role", input: "dropdown" },
];

export const ExamFields = [
  {
    id: "subjectName",
    type: "text",
    name: "subjectName",
    input: "input",
    placeHolder: "Subject name",
  },

  {
    id: "questions",
    input: "array",
    children: [
      Array(15)
        .fill()
        .map((_, index) => [
          {
            id: "question",
            type: "text",
            name: "question",
            input: "input",
            placeholder: "Enter question",
          },
          {
            id: "answer",
            type: "text",
            name: "answers",
            input: "text",
            placeHolder: "Enter answer",
          },
          {
            id: "options",
            type: "text",
            name: "options",
            input: "text",
            placeHolder: `option ${index}`,
          },
        ]),
    ],
  },
  {
    id: "notes",
    input: "array",
    children: [
      {
        id: "note1",
        type: "text",
        name: "note1",
        input: "text",
        placeHolder: "Note 1",
      },
      {
        id: "note2",
        type: "text",
        name: "note2",
        input: "text",
        placeHolder: "Note 2",
      },
    ],
  },
];

export const links = [
  { url: "/profile/editName", name: "Edit Name" },
  { url: "/profile/resetPassword", name: "Change Password" },
];

export const loginFields = [
  {
    id: "email",
    name: "Email",
    type: "text",
    input: "input",
    placeholder: "Enter your email...",
  },
  {
    id: "password",
    name: "Password",
    type: "password",
    input: "password",
    placeholder: "Enter your password...",
  },
];

export const newPasswordFields = [
  {
    id: "password",
    name: "Password",
    type: "password",
    input: "password",
    placeholder: "New password...",
  },
  {
    id: "confirmPassword",
    name: "Confirm Password",
    type: "password",
    input: "password",
    placeholder: "Confirm password...",
  },
];

export const newPasswordInitial = {
  password: "",
  confirmPassword: "",
};

//form fields

export const forgotFields = [
  {
    id: "email",
    name: "Email",
    type: "text",
    input: "input",
    placeholder: "Enter your email...",
  },
];

export const ResetPasswordFields = [
  {
    id: "oldPassword",
    name: "Old Password",
    type: "password",
    input: "password",
    placeholder: "Old password...",
  },
  {
    id: "password",
    name: "New Password",
    type: "password",
    input: "password",
    placeholder: "New password...",
  },
  {
    id: "confirmPassword",
    name: "Confirm Password",
    type: "password",
    input: "password",
    placeholder: "Confirm new password...",
  },
];
