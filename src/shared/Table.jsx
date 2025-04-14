import { useNavigate } from "react-router-dom";
import ButtonCom from "./ButtonCom";
import "./css/table.css";

const Table = ({ tableHeader, tableData, isLoading, minWidth, error }) => {
  const navigate = useNavigate();
  if (error) {
    return (
      <div className="table-error-container">
        <p className="no-data">Something went wrong. Go back or Refresh page</p>
        <ButtonCom onClick={() => window.location.reload(false)}>
          Refresh
        </ButtonCom>
        <ButtonCom onClick={() => navigate(-1)}>Back</ButtonCom>
      </div>
    );
  }
  return (
    <div className="table-container">
      <table style={{ minWidth: minWidth || "800px" }}>
        <thead>
          <tr>
            {!!tableHeader.length &&
              tableHeader.map((val, index) => <th key={index}>{val}</th>)}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={tableHeader.length} className="no-data">
                Loading...
              </td>
            </tr>
          ) : tableData?.length ? (
            tableData?.map((val, index) => (
              <tr key={index}>
                {!!tableHeader.length &&
                  tableHeader.map((item, idx) => (
                    <td key={idx}>{val[item]}</td>
                  ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeader.length} className="no-data">
                Data not found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
