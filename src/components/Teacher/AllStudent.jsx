/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allStudentList } from "../../redux/action/teacherStudent";
import ButtonCom from "../../shared/ButtonCom";
import Table from "../../shared/Table";
import { getCookie } from "../../utils/getCookie";
import { allStudentHeader } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";
import "./css/slider.css";
import "./css/teacher.css";

const AllStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getCookie("authToken");
  const allStudentArray = useSelector((state) => state.teacherStudent);
  console.log(allStudentArray);

  const [allStudent, setAllStudent] = useState(true);
  const [data, setData] = useState([]);

  const verifiedStudent = useMemo(() => {
    return allStudentArray?.allStudent.length
      ? allStudentArray?.allStudent.filter((val) => val.status === "Active")
      : [];
  });

  const tableData = useMemo(() => {
    return (
      !!data.length &&
      data.map((val, index) => ({
        Index: ++index,
        Name: val.name,
        Email: val.email,
        Status:
          val.status === "Active" ? (
            <span className="activeStatus">Active</span>
          ) : (
            <span className="pendingStatus">Pending</span>
          ),
        Action: (
          <ButtonCom
            id={val._id}
            disabled={val.status === "Pending"}
            onClick={() => navigate(`/student/${val._id}`)}
          >
            Student Details
          </ButtonCom>
        ),
      }))
    );
  }, [data]);

  useEffect(() => {
    if (!allStudentArray?.allStudent?.length)
      dispatch(allStudentList("dashboard/Teachers", token));
  }, [token]);

  useEffect(() => {
    if (allStudent) {
      setData(allStudentArray?.allStudent);
    } else {
      setData(verifiedStudent);
    }
  }, [allStudent, allStudentArray]);

  return (
    <div>
      <div className="allStudentInner">
        <h1 style={{ textAlign: "center", color: "rgb(18, 219, 206)" }}>
          {allStudent ? "All Students" : "Verified Students"}
        </h1>
        <div className="verifiedStudent">
          <p style={{ fontSize: "18px" }}> See Verified Students </p>
          <label className="switch">
            <input type="checkbox" onClick={() => setAllStudent(!allStudent)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div style={{ maxWidth: "1000px", margin: "0px auto", width: "100%" }}>
        <Table
          tableHeader={allStudentHeader}
          tableData={tableData}
          minWidth={"900px"}
          isLoading={allStudentArray?.loading}
          error={allStudentArray?.error}
        />
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["teacher"] })(
  AllStudent,
);
