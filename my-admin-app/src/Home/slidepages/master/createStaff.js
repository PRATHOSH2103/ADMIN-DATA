

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify"

const API = "http://localhost:4004/api";

const CreateStaff = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const token = localStorage.getItem("adminToken");

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    

    const [formData, setFormData] = useState({
        staffName: "",
        dateOfJoining: "",
        userName: "",
        password: "",
        comments: ""
    });


    const authHeader = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    const fetchEmployees = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/employee`, authHeader);
            setEmployees(res.data);
        } catch (err) {
            console.error("Employee fetch error", err);
        }
    }, [authHeader]);;

    const fetchStaff = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/staff/${id}`, authHeader);
            const data = res.data;

            setFormData({
                staffName: data.staffName?._id || "",
                dateOfJoining: data.dateOfJoining
                    ? data.dateOfJoining.split("T")[0]
                    : "",
                userName: data.userName || "",
                password: "",
                comments: data.comments || ""
            });

        } catch (err) {
            console.error("Staff fetch error", err);
        }
    }, [id, authHeader]);

    useEffect(() => {
        fetchEmployees();

        if (isEdit) {
            fetchStaff();
        }

    }, [fetchEmployees, fetchStaff, isEdit]);

    /* HANDLE CHANGE */

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "staffName") {

            const selectedEmployee = employees.find(emp => emp._id === value);

            setFormData(prev => ({
                ...prev,
                staffName: value,
                dateOfJoining: selectedEmployee?.dateOfJoining
                    ? selectedEmployee.dateOfJoining.split("T")[0]
                    : ""
            }));

            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* SUBMIT */

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            if (isEdit) {

                await axios.put(`${API}/staff/${id}`, formData, authHeader);
                toast.success("Staff Updated Successfully");

            } else {

                await axios.post(`${API}/staff`, formData, authHeader);
                toast.success("Staff Created Successfully");
            }

            navigate("/dashboard/admin");

        } catch (err) {

            toast.error(err.response?.data?.message || "Failed to save staff");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div id="student-form">

            <div className="header">

                <div id="student" onClick={() => navigate("/dashboard/add-employee")}>
                    <TbUsersGroup /> Add Employee
                </div>

                <div id="center-letter">
                    {isEdit ? "Edit Staff" : "Create Staff"}
                </div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Master</span>&nbsp; › &nbsp; <span className="active">Create Staff</span>
                </div>

            </div>

            <br />

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>Staff Name <span id="star">*</span></label>

                    <select
                        name="staffName"
                        value={formData.staffName}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Staff</option>

                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.firstName} {emp.lastName}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="form-group">

                    <label>Date of Joining <span id="star">*</span></label>

                    <input
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                        required
                    />

                </div>



                <div className="form-group">

                    <label>User Name <span id="star">*</span></label>

                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div className="form-group">

                    <label>Password <span id="star">*</span></label>
                    {/* 
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEdit}
                        placeholder={isEdit ? "Leave blank to keep old password" : ""}
                    /> */}

                    <div style={{ position: "relative" }}>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEdit}
                            placeholder={isEdit ? "Leave blank to keep old password" : ""}
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                left: "370px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer"
                            }}
                        >
                            {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                            {showPassword ? "🙈" : "👁️"}
                        </span>

                    </div>
                </div>



                <div className="form-group">

                    <label>Comments <span id="star">*</span></label>

                    <input
                        type="text"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                    />

                </div>

                <br />

                <div id="registerBtn">
                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
                    </button>
                </div>

            </form>

        </div>
    );
};

export default CreateStaff;