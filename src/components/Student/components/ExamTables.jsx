/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import edit from "../../../assets/edit.svg";
import select from "../../../assets/select.svg";
import { examFormHeader } from "../../../utils/staticObj";
import ButtonCom from "../../../shared/ButtonCom";
import Table from '../../../shared/Table';

const ExamTables = ({
  exam,
  selectedAnswers,
  handleSubmit,
  handleRemainingAnswer,
  remainingAnswer,
  handleEditAnswer,
  remainingDataFun,
}) => {

  const remainingAnswerData = useMemo(() => {
    return remainingAnswer.map((q, idx) => ({
      Index: idx + 1,
      Question: q.question,
      Answer: "",
      Action: (
        <ButtonCom onClick={() => handleRemainingAnswer(idx)}>
          <span className="btnContainer">
            <img src={select} width="18px" height="18px" alt="select icon" />
            Select
          </span>
        </ButtonCom>
      ),
    }));
  }, [remainingAnswer]);

  const tableData = useMemo(() => {
    return exam.map((q, idx) => ({
      Index: idx + 1,
      Question: q.question,
      Answer: selectedAnswers[idx]?.answer,
      Action: (
        <ButtonCom onClick={() => handleEditAnswer(idx)}>
          <span className="btnContainer">
            <img src={edit} width="18px" height="18px" alt="edit icon" />
            Edit
          </span>
        </ButtonCom>
      ),
    }));
  }, [exam, selectedAnswers]);

  useEffect(() => {
    remainingDataFun(remainingAnswerData);
  }, [remainingAnswerData]);

  return (
    <div className="remainingAnsContainer">
      <div>
        <h2>Review Your Answers</h2>
        <div>
          <Table
            tableData={tableData}
            tableHeader={examFormHeader}
            dataNotFound={!exam.length}
          />
        </div>
      </div>
      {!!remainingAnswerData.length && (
        <div>
          <h2>Remaining Answers</h2>
          <div>
            <Table
              tableData={remainingAnswerData}
              tableHeader={examFormHeader}
              dataNotFound={!remainingAnswerData.length}
            />
          </div>
        </div>
      )}
      <ButtonCom color="green" onClick={() => handleSubmit("user")}>
        Final Submit
      </ButtonCom>
    </div>
  );
};

export default ExamTables;
