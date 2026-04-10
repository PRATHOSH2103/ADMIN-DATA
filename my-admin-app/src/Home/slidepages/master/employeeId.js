
import { useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../../../auth";
import { toast } from "react-toastify";

const EmployeeId = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");

  const handleSetEmployeeID = async (e) => {
    e.preventDefault();

    try {
      const res = await authAxios.get("/employee/next-id");

      const id = res.data.employeeId;

      navigate("/dashboard/add-employee", {
        state: { employeeId: id }
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Employee ID");
    }
  };

  return (
    <div id="master-form">
      <div className="header">

        <div id="student" onClick={() => navigate("/dashboard/add-employee")}>
          <TbUsersGroup /> &nbsp; Add Employee
        </div>

        <div id="center-letter">
          Set Employee ID
        </div>

        <div className="page" onClick={() => navigate("/dashboard")}>
          <span>Master</span> › <span className="active">Employee ID</span>
        </div>

      </div>

      <br />

      <form id="padding" onSubmit={handleSetEmployeeID}>

        <div className="form-group">
          <label>
            Employee ID <span id="star">*</span>
          </label>

          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="EMP-10001"
          />
        </div>

        <br />

        <div id="registerBtn">
          <button type="submit">Set ID</button>
        </div>

      </form>

    </div>
  );
};

export default EmployeeId;