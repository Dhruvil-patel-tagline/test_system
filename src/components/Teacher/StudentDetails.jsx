/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../../shared/Table";
import { getRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { studentTableHeader } from "../../utils/staticObj";
import "./css/teacher.css";
import AuthRoute from "../auth/AuthRoute";

const StudentDetails = () => {
  const { id } = useParams();
  const token = getCookie("authToken");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState({});

  const tableData = useMemo(() => {
    return studentData?.Result?.length
      ? studentData?.Result.map((val, index) => ({
        Index: ++index,
        Subject: val.subjectName,
        Score:
          val.score <= 3 ? (
            <span style={{ color: "red" }}>{val.score}</span>
          ) : (
            <span style={{ color: "green" }}>{val.score}</span>
          ),
        Rank:
          val.rank <= 3 ? (
            <span style={{ color: "blue" }}>{val.rank}</span>
          ) : (
            <span style={{ color: "green" }}>{val.rank}</span>
          ),
      }))
      : [];
  }, [studentData]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRequest(
          `dashboard/Teachers/viewStudentDetail?id=${id}`,
          token,
        );
        if (response.statusCode === 200) {
          setStudentData(response.data[0]);
        } else {
          setError(response?.message || "Error occurred");
        }
      } catch (error) {
        setError(error?.message || "Error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [id, token]);

  return (
    <div className="studentDetailsRoot">
      <div className="studentDetailsInner">
        <p>Name: {studentData?.name}</p>
        <p>Email: {studentData?.email}</p>
      </div>
      <div className="studentDetailsTable">
        <Table
          tableHeader={studentTableHeader}
          tableData={tableData}
          isLoading={loading}
          minWidth={"500px"}
          error={error}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["teacher"] })(StudentDetails);
