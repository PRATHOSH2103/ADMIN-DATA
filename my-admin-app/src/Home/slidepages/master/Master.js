
import { useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../../../auth";
import { toast } from "react-toastify";

const Master = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");

  const handleSetStudentID = async (e) => {
    e.preventDefault();

    try {
      const res = await authAxios.get("/students/next-id");

      const id = res.data.studentId;

      navigate("/dashboard/add-student", {
        state: { studentId: id }
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Student ID");
    }
  };

  return (
    <div id="master-form">
      <div className="header">

        <div id="student" onClick={() => navigate("/dashboard/add-student")}>
          <TbUsersGroup /> &nbsp; Add Student
        </div>

        <div id="center-letter">
          Set Student ID
        </div>

        <div className="page" onClick={() => navigate("/dashboard")}>
          <span>Master</span>&nbsp; › &nbsp;<span className="active">Student ID</span>
        </div>

      </div>

      <br />

      <form id="padding" onSubmit={handleSetStudentID}>

        <div className="form-group">
          <label>
            Student ID <span id="star">*</span>
          </label>

          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="KIT-10001"
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

export default Master;