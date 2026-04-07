import { useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../../../auth";
import { toast } from "react-toastify";

const EmployeeType = () => {
    const navigate = useNavigate();

    //  correct state
    const [type, setType] = useState("");

    //  correct function
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!type.trim()) {
            toast.error("Employee Type is required");
            return;
        }

        try {
            await authAxios.post("/employee-type", { type });

            toast.success("Employee Type Added Successfully");
            setType(""); // clear input

        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding type");
        }
    };

    return (
        <div id="master-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/add-employee")}>
                    <TbUsersGroup /> &nbsp; Add Employee
                </div>

                <div id="center-letter">Employee Type</div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Master</span>&nbsp;›&nbsp;
                    <span className="active">Employee Type</span>
                </div>
            </div>

            <br />


            <form id="padding" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Employee Type <span id="star">*</span>
                    </label>

                    <input
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Enter Employee Type (e.g. Remote, Onsite)"
                    />
                </div>

                <br />

                <div id="registerBtn">
                    <button type="submit">Add Employee Type</button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeType;