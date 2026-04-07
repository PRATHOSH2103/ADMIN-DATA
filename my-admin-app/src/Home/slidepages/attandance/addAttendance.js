import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

const AddAttendance = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const isEdit = Boolean(id);

    const token = localStorage.getItem("adminToken");

    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        employeeId: "",
        statusWork: "",
        permission: "",
        leave: "",
        inDate: "",
        outDate: "",
        inTime: "",
        outTime: "",
        comments: ""
    });


    useEffect(() => {
        axios
            .get("http://localhost:4004/api/employee", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setEmployees(res.data))
            .catch(err => console.log(err));
    }, [token]);

    useEffect(() => {
        if (!isEdit) return;

        axios.get(`http://localhost:4004/api/attendance/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const a = res.data;


                setFormData({
                    employeeId: a.employeeId?._id || "",
                    statusWork: a.statusWork || "",
                    permission: a.permission ? "yes" : "no",
                    leave: a.leave ? "yes" : "no",
                    inDate: a.inDate?.slice(0, 10) || "",
                    outDate: a.outDate?.slice(0, 10) || "",
                    inTime: a.inTime || "",
                    outTime: a.outTime || "",
                    comments: a.comments || ""
                });

            });
    }, [id, isEdit, token]);

    // 🔹 Handle change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEdit
                ? `http://localhost:4004/api/attendance/${id}`
                : "http://localhost:4004/api/attendance";

            const method = isEdit ? "put" : "post";

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(isEdit ? "Attendance Updated Successfully" : "Attendance Added Successfully");
            navigate("/dashboard/attendance-list");
        } catch (err) {
            toast.error("Failed to save attendance");
        }
    };


    return (
        <div id="student-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/attendance-list")}>
                    <TbUsersGroup /> Attendance List
                </div>
                <div id="center-letter">
                    {isEdit ? "Edit Attendance" : "Register Employee Attendance"}
                </div>
                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Attendance </span>&nbsp;›&nbsp;
                    <span className="active">Add Attendance</span>
                </div>
            </div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Select Employee <span id="star">*</span></label>
                    <select
                        name="employeeId"
                        required
                        value={formData.employeeId}
                        onChange={handleChange}
                    >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.firstName} - {emp.employeeId}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Status Work <span id="star">*</span></label>
                    <select
                        name="statusWork"
                        required
                        value={formData.statusWork}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half Day">Half Day</option>
                    </select>
                </div>


                {/* <div className="form-group">
                    <label className="form-label">
                        Permission <span className="required">*</span>
                    </label>
                    &nbsp;
                    <div className="cash-type">
                        <label className="radio-item">
                            <input type="radio" name="permission" value="yes" />
                            <span>Yes</span>
                        </label>

                        <label className="radio-item">
                            <input type="radio" name="permission" value="no" />
                            <span>NO</span>
                        </label>

                    </div>
                </div> */}

                <div className="form-group">
                    <label className="form-label">
                        Permission <span className="required">*</span>
                    </label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="permission"
                                value="yes"
                                checked={formData.permission === "yes"}
                                onChange={handleChange}
                            />
                            <span>Yes</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="permission"
                                value="no"
                                checked={formData.permission === "no"}
                                onChange={handleChange}
                            />
                            <span>No</span>
                        </label>

                    </div>
                </div>



                <div className="form-group">
                    <label className="form-label">
                        Leave <span className="required">*</span>
                    </label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="leave"
                                value="yes"
                                checked={formData.leave === "yes"}
                                onChange={handleChange}
                            />
                            <span>Yes</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="leave"
                                value="no"
                                checked={formData.leave === "no"}
                                onChange={handleChange}
                            />
                            <span>No</span>
                        </label>

                    </div>
                </div>

                <div className="form-group">
                    <label>In Date <span id="star">*</span></label>
                    <input type="date" name="inDate" required
                        value={formData.inDate ? formData.inDate.slice(0, 10) : ""}
                        onChange={handleChange} />
                </div>


                <div className="form-group">
                    <label>Out Date</label>
                    <input type="date" name="outDate"
                        value={formData.outDate ? formData.outDate.slice(0, 10) : ""}
                        onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>In Time <span id="star">*</span></label>
                    <input type="time" name="inTime" required
                        value={formData.inTime || ""}
                        onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Out Time</label>
                    <input type="time" name="outTime"
                        value={formData.outTime || ""}
                        onChange={handleChange} />
                </div>

                <div className="form-group full-width">
                    <label>Comments</label>
                    <input type="text" name="comments"
                        value={formData.comments}
                        onChange={handleChange} />
                </div>

                <div id="registerBtn"><button type="submit">{isEdit ? "Update" : "Submit"}</button></div>

            </form>
        </div>
    );
};

export default AddAttendance;
