/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TimeLeft = ({ setIsSubmitting, handleSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(
    localStorage.getItem("timeLeftData") || 120,
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsSubmitting(true);
      handleSubmit();
      return;
    }
    if (timeLeft === 30) {
      toast.warning("Only 30 seconds left! Hurry up!");
    }
    const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    localStorage.setItem("timeLeftData", timeLeft - 1);
    return () => clearInterval(timer);
  }, [timeLeft]);
  return (
    <p style={{ color: timeLeft <= 30 ? "red" : "white" }}>
      Time Left: {Math.floor(timeLeft / 60)}:
      {(timeLeft % 60).toString().padStart(2, "0")}
    </p>
  );
};

export default TimeLeft;
