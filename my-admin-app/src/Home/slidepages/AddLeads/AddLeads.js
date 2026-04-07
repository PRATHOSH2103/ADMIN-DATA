
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoReceiptSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

const AddLeads = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const token = localStorage.getItem("adminToken");

    const [courses, setCourses] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        date: "",
        name: "",
        qualification: "",
        yearOfPassing: "",
        phoneNumber: "",
        location: "",
        followUpStatus: "",
        detailsSent: "",
        assignedTo: "",
        course: "",
        source: ""
    });

    // 🔹 Load Courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:4004/api/course",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setCourses(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (token) fetchCourses();

    }, [token]);

    // 🔹 Load Lead for Edit
    useEffect(() => {

        if (!isEdit || !token) return;

        axios
            .get(`http://localhost:4004/api/leads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            .then((res) => {
                const d = res.data;

                setFormData({
                    date: d.date?.slice(0, 10) || "",
                    name: d.name || "",
                    qualification: d.qualification || "",
                    yearOfPassing: d.yearOfPassing || "",
                    phoneNumber: d.phoneNumber || "",
                    location: d.location || "",
                    followUpStatus: d.followUpStatus?.trim() || "",
                    detailsSent: d.detailsSent?.trim() || "",
                    assignedTo: d.assignedTo?.trim() || "",
                    course: d.course?.trim() || "",
                    source: d.source?.trim() || ""
                });
            })
            .catch(() => alert("Failed to load lead"));

    }, [id, isEdit, token]);


    // 🔹 Handle Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const payload = {
                ...formData,
                date: formData.date ? new Date(formData.date) : null
            };

            if (isEdit) {

                await axios.put(
                    `http://localhost:4004/api/leads/${id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Lead Updated Successfully");

            } else {

                await axios.post(
                    "http://localhost:4004/api/leads",
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Lead Created Successfully");
            }

            navigate("/dashboard/manage-leads");

        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.message || "Save failed");
        }
    };




    // fetch course 
    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const res = await axios.get("http://localhost:4004/api/courses");

                console.log("Courses:", res.data);

                setCourses(res.data);

            } catch (err) {
                console.log(err);
            }

        };

        fetchCourses();

    }, []);

    // fetch assignedTo 
    useEffect(() => {
        axios
            .get("http://localhost:4004/api/employee", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setEmployees(res.data))
            .catch(err => console.log(err));
    }, [token]);

    return (
        <div id="student-form">
            <div className="header">

                <div id="student" onClick={() => navigate("/dashboard/manage-leads")}>
                    <IoReceiptSharp />&nbsp; Leads
                </div>

                <div id="center-letter">
                    {isEdit ? "Edit Lead" : "Register Leads"}
                </div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Leads</span> &nbsp;›&nbsp;
                    <span className="active">Add Lead</span>
                </div>
            </div>

            <br />
            <br />

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Date <span id="star">*</span></label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label>Name <span id="star">*</span></label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label>Qualification <span id="star">*</span></label>
                    <input
                        type="text"
                        name="qualification"
                        required
                        value={formData.qualification}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label>Year of Passing <span id="star">*</span></label>
                    <input
                        type="text"
                        name="yearOfPassing"
                        required
                        value={formData.yearOfPassing}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label>Phone Number <span id="star">*</span></label>
                    <input
                        type="text"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label>Location <span id="star">*</span></label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
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
                        <option value="">Select</option>
                        <option value="Interest">Interest</option>
                        <option value="Not Interest">Not Interest</option>
                        <option value="Call Back">Call Back</option>
                        <option value="No Response">No Response</option>
                        <option value="Call Done">Call Done</option>


                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Details Sent <span className="required"><span id="star">*</span></span>
                    </label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="detailsSent"
                                value="Yes"
                                checked={formData.detailsSent === "Yes"}
                                onChange={handleChange}
                            />
                            <span>Yes</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="detailsSent"
                                value="No"
                                checked={formData.detailsSent === "No"}
                                onChange={handleChange}
                            />
                            <span>No</span>
                        </label>

                    </div>
                </div>

                <div className="form-group">
                    <label>Assigned To <span id="star">*</span></label>
                    <select
                        name="assignedTo"
                        required
                        value={formData.assignedTo}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.firstName} - {emp.lastName}
                            </option>
                        ))}

                    </select>
                </div>


                <div className="form-group">
                    <label>Course <span id="star">*</span></label>
                    <select
                        name="course"
                        required
                        value={formData.course}
                        onChange={handleChange}
                    >

                        <option value="">Select Course</option>
                        {courses.map((c) => (
                            <option key={c._id} value={c.course}>
                                {c.course}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="form-group">
                    <label>Source <span id="star">*</span></label>
                    <select
                        name="source"
                        required
                        value={formData.source}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Referral">Referral</option>
                        <option value="Ads">Ads</option>

                    </select>
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

export default AddLeads;
