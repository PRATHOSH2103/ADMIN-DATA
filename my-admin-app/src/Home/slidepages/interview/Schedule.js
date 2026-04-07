
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";


import { toast } from "react-toastify";


const Schedule = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const token = useMemo(() => {
        return localStorage.getItem("adminToken");
    }, []);

    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    };

    const [formData, setFormData] = useState({
        interviewDate: "",
        intervieweeName: "",
        email: "",
        phoneNumber: "",
        qualification: "",
        yearOfPassing: "",
        location: "",
        followUpStatus: "",
        scheduleDate: "",
        jobrole: "",
        source: "",
        uploadPhoto: null,
    });



    useEffect(() => {
        if (isEdit) {
            const fetchInterview = async () => {
                const res = await axios.get(
                    `http://localhost:4004/api/interviews/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setFormData(res.data);
            };
            fetchInterview();
        }
    }, [id, isEdit, token]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
            fd.append(k, v);
        });

        try {
            if (isEdit) {
                await axios.put(
                    `http://localhost:4004/api/interviews/${id}`,
                    fd,
                    authHeader
                );
                toast.success("Interview Updated Successfully");
            } else {
                await axios.post(
                    "http://localhost:4004/api/interviews",
                    fd,
                    authHeader
                );
                toast.success("Interview Added Successfully");
            }

            navigate("/dashboard/manage-schedule");

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save interview");
        }
    };

    return (
        <div id="student-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/manage-schedule")}>
                    <TbUsersGroup />&nbsp; Interview List
                </div>
                <div id="center-letter">
                    {isEdit ? "Edit Interview" : "Schedule Interview"}
                </div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Interview</span>
                    &nbsp;
                    <span className="separator">›</span>
                    &nbsp;
                    <span className="active">Schedule</span>
                </div>
            </div>

            <br /><br />

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Interview Date <span id="star">*</span></label>
                    <input
                        type="date"
                        name="interviewDate"
                        required
                        value={formData.interviewDate ? formData.interviewDate.slice(0, 10) : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Interviewee Name <span id="star">*</span></label>
                    <input
                        name="intervieweeName"
                        required
                        value={formData.intervieweeName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Email <span id="star">*</span></label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number <span id="star">*</span></label>
                    <input
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Qualification <span id="star">*</span></label>
                    <input
                        name="qualification"
                        required
                        value={formData.qualification || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Year of Passing <span id="star">*</span></label>
                    <input
                        name="yearOfPassing"
                        required
                        value={formData.yearOfPassing || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Location <span id="star">*</span></label>
                    <input
                        name="location"
                        required
                        value={formData.location || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Following Updates <span id="star">*</span></label>
                    <select
                        name="followUpStatus"
                        required
                        value={formData.followUpStatus}
                        onChange={handleChange}
                    >
                        <option value="">Select Follow up Dates</option>
                        <option value="Interest">Interest</option>
                        <option value="Not Interest">Not Interest</option>
                        <option value="Call Back">Call Back</option>
                        <option value="No Response">No Response</option>
                        <option value="Call Done">Call Done</option>


                    </select>
                </div>

                <div className="form-group">
                    <label>Schedule Date <span id="star">*</span></label>
                    <input
                        type="date"
                        name="scheduleDate"
                        required
                        value={formData.scheduleDate ? formData.scheduleDate.slice(0, 10) : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Job Role <span id="star">*</span></label>
                    <input
                        name="jobrole"
                        required
                        value={formData.jobrole || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Source <span id="star">*</span></label>
                    <input
                        name="source"
                        required
                        value={formData.source || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label>Upload Photo <span id="star">*</span></label>
                    <input
                        type="file"
                        name="uploadPhoto"
                        onChange={handleChange}
                    />
                </div>

                <br />
                <div id="registerBtn">
                    <button type="submit">
                        {isEdit ? "Update" : "Submit"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Schedule;