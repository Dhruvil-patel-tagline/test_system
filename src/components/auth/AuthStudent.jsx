// import { Navigate } from "react-router-dom";
// import { getCookie } from "../../utils/getCookie";

// const AuthStudent = ({ children }) => {
//   const user = getCookie("authUser");
//   const token = getCookie("authToken");
//   if (!user || !token) {
//     document.cookie = "authToken=; path=/; max-age=0";
//     document.cookie = "authUser=; path=/; max-age=0";
//     <Navigate to="/login" />;
//   }
//   return user?.role === "student" ? children : <Navigate to="/login" />;
// };

// export default AuthStudent;
