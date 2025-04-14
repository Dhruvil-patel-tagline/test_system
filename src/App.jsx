import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import router from "./router/router";

function App() {
  return (
    <div className="rootContainer">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
