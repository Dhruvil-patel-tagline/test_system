/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../../shared/Table";
import { getCookie } from "../../utils/getCookie";
import { studentResultHeader } from "../../utils/staticObj";
import AuthRoute from "../auth/AuthRoute";

const StudentResult = () => {
  const { state } = useLocation();
  const user = getCookie("authUser") || {};

  const tableData = useMemo(() => {
    return state?.Result.map((res, index) => ({
      Index: index + 1,
      Subject: res.subjectName,
      Score:
        res.score <= 3 ? (
          <span style={{ color: "red" }}>{res.score}</span>
        ) : (
          <span style={{ color: "green" }}>{res.score}</span>
        ),
      Rank:
        res.rank <= 3 ? (
          <span style={{ color: "blue" }}>{res.rank}</span>
        ) : (
          <span style={{ color: "green" }}>{res.rank}</span>
        ),
    }));
  }, [state]);

  useEffect(() => {
    if (state?.Result?.[0]?.rank === 1 && state?.Result?.[0].score > 3) {
      toast.success("🎉 Congratulations! You've achieved the top rank.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="studentResultContainer">
      <h1 className="resultHeading">
        Hi,{" "}
        {user?.name.charAt(0).toUpperCase() + user?.name.slice(1) || "Unknown"}.
        Your result is
      </h1>
      <p style={{ padding: "10px 0px" }}>{user?.email || "Data not found"}</p>
      <div style={{ maxWidth: "900px", padding: "10px", width: "100%" }}>
        <Table
          tableData={tableData}
          tableHeader={studentResultHeader}
          minWidth={"450px"}
        />
      </div>
      <div style={{ padding: "10px" }}>
        {state?.Result?.[0].score <= 3 ? (
          <p style={{ color: "red" }}>Your exam result was a failure. </p>
        ) : (
          <p style={{ color: "green" }}>
            Congratulations! You passed the test.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ["student"] })(
  StudentResult,
);
