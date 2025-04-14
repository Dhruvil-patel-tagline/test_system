import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export function useNavigationBlocker(blockCondition, onNavigate, isSubmitting) {
  let confirmText =
    "Do you really wish to exit the website before submitting? It causes the exam to be automatically submitted.";

  const shouldBlock = () => {
    if (!isSubmitting && blockCondition && confirm(confirmText)) {
      onNavigate();
      return false;
    }
    if (isSubmitting) {
      return false;
    }
    return true;
  };

  // eslint-disable-next-line no-unused-vars
  const blocker = useBlocker(shouldBlock);

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = confirmText;
    return confirmText;
  };

  useEffect(() => {
    if (!isSubmitting) {
      window.addEventListener("beforeunload", alertUser);
    }
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
}
