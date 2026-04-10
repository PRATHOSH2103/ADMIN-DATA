
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate, useLocation, useParams } from "react-router-dom"

import { toast } from "react-toastify";

const AddStudent = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const location = useLocation();
    const isEdit = Boolean(id);

    const [courses, setCourses] = useState([]);

    const [staffList, setStaffList] = useState([]);

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

        firstName: "",
        lastName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        email: "",
        address: "",
        contactNumber: "",
        alternateNumber: "",
        gender: "",
        maritalStatus: "",
        qualification: "",
        workExperience: "",
        course: "",
        totalAmount: "",
        remainingAmount: "",
        mentor: "",
        dateOfJoining: "",
        studentStatus: "",
        remarks: "",
        uploadPhoto: null,
    });


    useEffect(() => {
        if (isEdit) {

            const fetchStudent = async () => {

                const res = await axios.get(
                    `http://localhost:4004/api/students/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // setFormData(res.data);

                setFormData({
                    ...res.data,
                    gender: res.data.gender?.toLowerCase(),
                    maritalStatus: res.data.maritalStatus?.toLowerCase()
                });
            };

            fetchStudent();

        } else if (location.state?.studentId) {

            setFormData(prev => ({
                ...prev,
                studentId: location.state.studentId
            }));
        }
    }, [id, isEdit, location.state, token]);


    // 6/3
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "course") {

            const selectedCourse = courses.find(
                (c) => c.course === value
            );

            setFormData((prev) => ({
                ...prev,
                course: value,
                totalAmount: selectedCourse ? selectedCourse.fees : ""
            }));

            return;
        }

        if (name === "workExperience" && value < 0) return;
        if (name === "totalAmount" && value < 0) return;
        if (name === "remainingAmount" && value < 0) return;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

        try {

            if (isEdit) {
                await axios.put(
                    `http://localhost:4004/api/students/${id}`,
                    fd,
                    authHeader
                );
                toast.success("Student Updated Successfully")
            } else {
                await axios.post(
                    "http://localhost:4004/api/students",
                    fd,
                    authHeader
                );

                toast.success("Student Added Successfully")
            }
            navigate("/dashboard/add-student-list");

        } catch (err) {

            toast.error(err.response?.data?.message || "Failed to save student");
        }


    };



    // 6/3

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


    // fetch staff

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:4004/api/staff",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setStaffList(res.data);

            } catch (err) {
                console.log("Staff fetch error", err);
            }
        };

        fetchStaff();
    }, [token]);

    return (

        <div id="student-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/add-student-list")}><TbUsersGroup />&nbsp; Students List</div>
                <div id="center-letter">
                    {isEdit ? "Edit Student" : "Register Student "}
                </div>
                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Student Info</span>
                    &nbsp;
                    <span className="separator">›</span>
                    &nbsp;
                    <span className="active">Add Student</span>
                </div>
            </div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="studentId">Student Id <span id="star">*</span></label>
                    <input
                        id="studentId"
                        placeholder="Student ID"
                        // value={location.state?.studentId || ""}
                        value={formData.studentId || ""}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="firstName">First Name <span id="star">*</span></label>
                    <input
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        required
                        value={formData.firstName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name <span id="star">*</span></label>
                    <input
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        required
                        value={formData.lastName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fatherName">Father Name <span id="star">*</span></label>
                    <input
                        id="fatherName"
                        name="fatherName"
                        placeholder="Father Name"
                        required
                        value={formData.fatherName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="motherName">Mother Name <span id="star">*</span></label>
                    <input
                        id="motherName"
                        name="motherName"
                        placeholder="Mother Name"
                        required
                        value={formData.motherName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dateofbirth">DOB <span id="star">*</span></label>
                    <input
                        id="dob"
                        name="dob"
                        type="date"
                        required
                        value={formData.dob ? formData.dob.slice(0, 10) : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email <span id="star">*</span></label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address <span id="star">*</span></label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Address"
                        required
                        value={formData.address || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number <span id="star">*</span></label>
                    <input
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="Contact Number"
                        required
                        value={formData.contactNumber || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="alternateNumber">Alternate Number <span id="star">*</span></label>
                    <input
                        id="alternateNumber"
                        name="alternateNumber"
                        placeholder="Alternate Number"
                        required
                        value={formData.alternateNumber || ""}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label className="form-label">
                        Gender <span className="required">*</span>
                    </label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === "male"}
                                onChange={handleChange}
                            />
                            <span>Male</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === "female"}
                                onChange={handleChange}
                            />
                            <span>Female</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="gender"
                                value="others"
                                checked={formData.gender === "others"}
                                onChange={handleChange}
                            />
                            <span>Others</span>
                        </label>

                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Marital Status <span className="required">*</span>
                    </label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="married"
                                checked={formData.maritalStatus === "married"}
                                onChange={handleChange}
                            />
                            <span>Married</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="unmarried"
                                checked={formData.maritalStatus === "unmarried"}
                                onChange={handleChange}
                            />
                            <span>Unmarried</span>
                        </label>

                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="qualification">Qualification <span id="star">*</span></label>

                    <input
                        type="text"
                        name="qualification"
                        required
                        value={formData.qualification || ""}
                        onChange={handleChange}
                    />

                    {/* <select
                        id="qualification"
                        name="qualification"
                        required
                        value={formData.qualification || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Qualification</option>
                        <option value="BCom">B.Com</option>
                        <option value="BATamil">BA Tamil</option>
                        <option value="BScCS">BSc CS</option>
                        <option value="MCom">M.Com</option>
                        <option value="BTech">B.Tech</option>
                        <option value="BAHistory">BA History</option>
                        <option value="BAComputerScience">BA Computer Science</option>
                        <option value="Others">Others</option>
                    </select> */}
                </div>

                <div className="form-group">
                    <label htmlFor="workExperience">Work Experience <span id="star">*</span></label>
                    <input
                        id="workExperience"
                        name="workExperience"
                        type="Number"
                        min="0"
                        step="1"
                        value={formData.workExperience || ""}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="course">Course<span id="star">*</span></label>
                    <select
                        id="course"
                        name="course"
                        required
                        value={formData.course || ""}
                        onChange={handleChange}
                    >

                        <option value="">Select Course</option>

                        {courses.map((c) => (
                            <option key={c._id} value={c.course}>
                                {c.course}
                            </option>
                        ))}

                    </select>
                    {/* <select
                        id="course"
                        name="course"
                        type="text"
                        required
                        value={formData.course || ""}
                        onChange={handleChange}
                    >
                        <option value="">Course</option>
                        <option value="DigitalMarketing">Digital Marketing</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Mern stack Developer">Mern stack Developer</option>
                        <option value="Video Editing">Video Editing</option>
                    </select> */}
                </div>

                <div className="form-group">
                    <label htmlFor="totalAmount">Total Amount <span id="star">*</span></label>
                    <input
                        id="totalAmount"
                        name="totalAmount"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.totalAmount || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="remainingAmount">Remaining Amount <span id="star">*</span></label>
                    <input
                        id="remainingAmount"
                        name="remainingAmount"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.remainingAmount || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mentor">Mentor <span id="star">*</span></label>
                    <select
                        id="mentor"
                        name="mentor"
                        required
                        value={formData.mentor || ""}
                        onChange={handleChange}
                    >
                        {/* <option value="">Select Mentor</option>
                        <option value="Aravind">Aravind</option>
                        <option value="Sussendran">Sussendran</option> */}

                        <option value="">Select Mentor</option>

                        {staffList.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                                {staff.userName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfJoining">Date of Joining <span id="star">*</span></label>
                    <input
                        id="dateOfJoining"
                        name="dateOfJoining"
                        type="date"
                        required
                        value={formData.dateOfJoining ? formData.dateOfJoining.slice(0, 10) : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="studentStatus">Student Status <span id="star">*</span></label>
                    <select
                        id="studentStatus"
                        name="studentStatus"
                        required
                        value={formData.studentStatus || ""}
                        onChange={handleChange}
                    >

                        <option value="Status">Status</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Completed">Completed</option>

                    </select>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="uploadPhoto">Upload photo <span id="star">*</span></label>
                    <input
                        id="uploadPhoto"
                        name="uploadPhoto"
                        type="file"
                        // required
                        // value={formData.uploadPhoto || ""}
                        onChange={handleChange}
                    >

                    </input>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="remarks">Remarks <span id="star">*</span></label>
                    <input
                        id="remarks"
                        name="remarks"
                        type="text"
                        required
                        value={formData.remarks || ""}
                        onChange={handleChange}
                    >

                    </input>
                </div>
                <br />
                <div id="registerBtn"><button type="submit">{isEdit ? "Update" : "Submit"}</button></div>

            </form>
        </div>

    );
};

export default AddStudent;



