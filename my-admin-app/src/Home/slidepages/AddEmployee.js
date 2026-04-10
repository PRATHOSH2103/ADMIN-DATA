
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate, useLocation, useParams } from "react-router-dom"

import { toast } from "react-toastify";

const Addemployee = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const location = useLocation();
    const isEdit = Boolean(id);

    const [employeeTypes, setEmployeeTypes] = useState([]);

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
        employeeId: "",
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
        designation: "",
        salary: "",
        annualsalary: "",
        dateOfJoining: "",
        dateOfRelieving: "",
        isStaff: "",
        staffdateOfJoining: "",
        aadhar: "",
        panNumber: "",
        accountnumber: "",
        employeeType: "",
        remarks: "",
        uploadPhoto: null,
    });



    useEffect(() => {
        const fetchEmployeeId = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:4004/api/create-employee-id",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setFormData(prev => ({
                    ...prev,
                    employeeId: res.data.employeeId
                }));

            } catch (err) {
                console.error("Employee ID error", err);
            }
        };

        if (!isEdit) {
            fetchEmployeeId();
        }
    }, [isEdit, token]);



    useEffect(() => {
        if (isEdit) {

            const fetchStudent = async () => {

                const res = await axios.get(
                    `http://localhost:4004/api/employee/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setFormData(res.data);
            };

            fetchStudent();

        } else if (location.state?.employeeId) {

            setFormData(prev => ({
                ...prev,
                employeeId: location.state.employeeId
            }));
        }
    }, [id, isEdit, location.state, token]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        let val = files ? files[0] : value;

        // convert number fields
        if (["workExperience", "salary", "annualsalary"].includes(name)) {
            val = value === "" ? "" : Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };


    const handleSubmit = async e => {
        e.preventDefault();

        // const fd = new FormData();
        // Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

        const fd = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fd.append(key, value);
            }
        });


        try {

            if (isEdit) {
                await axios.put(
                    `http://localhost:4004/api/employee/${id}`,
                    fd,
                    authHeader
                );
                toast.success("Employee Updated Successfully")
            } else {
                await axios.post(
                    "http://localhost:4004/api/employee",
                    fd,
                    authHeader
                );

                toast.success("Employee Added Successfully")
            }
            navigate("/dashboard/add-employee-list");

        } catch (err) {

            toast.error(err.response?.data?.message || "Failed to save employee");
        }


    };


    // fetch employee type 
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:4004/api/employee-type",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setEmployeeTypes(res.data);
            } catch (err) {
                console.error("Error fetching types", err);
            }
        };

        fetchTypes();
    }, [token]);



    return (

        <div id="student-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/add-employee-list")}><TbUsersGroup />&nbsp; Employees List</div>
                <div id="center-letter">
                    {isEdit ? "Edit Employee" : "Register Employee "}
                </div>
                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Student Info</span>
                    &nbsp;
                    <span className="separator">›</span>
                    &nbsp;
                    <span className="active">Add Employee</span>
                </div>
            </div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="employeeId">Employee Id <span id="star">*</span></label>
                    <input
                        id="employeeId"
                        // name="employeeId"
                        placeholder="employee ID"
                        // value={location.state?.employeeId || ""}
                        value={formData.employeeId || ""}
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
                    <label htmlFor="email">Email Id<span id="star">*</span></label>
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
                    <label>Gender <span id="star">*</span></label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === "Male"}
                                onChange={handleChange}
                            />
                            <span>Male</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === "Female"}
                                onChange={handleChange}
                            />
                            <span>Female</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="gender"
                                value="Others"
                                checked={formData.gender === "Others"}
                                onChange={handleChange}
                            />
                            <span>Others</span>
                        </label>

                    </div>
                </div>


                {/* MARITAL STATUS */}

                <div className="form-group">
                    <label>Marital Status <span id="star">*</span></label>

                    <div className="cash-type">

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="Married"
                                checked={formData.maritalStatus === "Married"}
                                onChange={handleChange}
                            />
                            <span>Married</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="Unmarried"
                                checked={formData.maritalStatus === "Unmarried"}
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
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.workExperience || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="designation">Designation <span id="star">*</span></label>
                    <input
                        id="designation"
                        name="designation"
                        type="text"
                        required
                        value={formData.designation || ""}
                        onChange={handleChange}
                    >
                    </input>
                </div>

                <div className="form-group">
                    <label htmlFor="salary">Salary <span id="star">*</span></label>
                    <input
                        id="salary"
                        name="salary"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.salary || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="annualsalary">Auunual Salary <span id="star">*</span></label>
                    <input
                        id="annualsalary"
                        name="annualsalary"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.annualsalary || ""}
                        onChange={handleChange}
                    />
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


                {isEdit && (
                    <div className="form-group full-width">
                        <label htmlFor="dateOfRelieving">Date of Relieving <span id="star">*</span></label>
                        <input
                            id="dateOfRelieving"
                            name="dateOfRelieving"
                            type="date"
                            value={formData.dateOfRelieving ? formData.dateOfRelieving.slice(0, 10) : ""}
                            onChange={handleChange}
                        />
                    </div>
                )}


                <div className="form-group">
                    <label htmlFor="isStaff">Is staff <span id="star">*</span></label>

                    <div className="cash-type">
                        <label className="radio-item">
                            <input
                                type="radio"
                                name="isStaff"
                                value="Yes"
                                checked={formData.isStaff === "Yes"}
                                onChange={handleChange}
                            />
                            <span>Yes</span>
                        </label>

                        <label className="radio-item">
                            <input
                                type="radio"
                                name="isStaff"
                                value="No"
                                checked={formData.isStaff === "No"}
                                onChange={handleChange}
                            />
                            <span>No</span>
                        </label>

                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="staffdateOfJoining">Staff Date of Joining <span id="star">*</span></label>
                    <input
                        id="staffdateOfJoining"
                        name="staffdateOfJoining"
                        type="date"
                        required
                        value={formData.staffdateOfJoining ? formData.staffdateOfJoining.slice(0, 10) : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="aadhar">Aadhar Number <span id="star">*</span></label>
                    <input
                        id="aadhar"
                        name="aadhar"
                        type="number"
                        required
                        value={formData.aadhar || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="panNumber">PAN Number <span id="star">*</span></label>
                    <input
                        id="panNumber"
                        name="panNumber"
                        type="number"
                        required
                        value={formData.panNumber || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="accountnumber">Account Number <span id="star">*</span></label>
                    <input
                        id="accountnumber"
                        name="accountnumber"
                        type="number"
                        required
                        value={formData.accountnumber || ""}
                        onChange={handleChange}
                    />
                </div>



                <div className="form-group">
                    <label htmlFor="employeeType">Employee Type <span id="star">*</span></label>
                    {/* <select id="employeeType" name="employeeType" required
                        value={formData.employeeType || ""}
                        onChange={handleChange}>
                        <option value="">Select Employee Type</option>
                        <option value="Work from home">Work from home</option>
                        <option value="On site">On site</option>
                    </select> */}


                    <select
                        id="employeeType"
                        name="employeeType"
                        required
                        value={formData.employeeType || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Employee Type</option>

                        {employeeTypes.map((item) => (
                            <option key={item._id} value={item.type}>
                                {item.type}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="form-group full-width">
                    <label htmlFor="uploadPhoto">Upload photo <span id="star">*</span></label>
                    <input
                        id="uploadPhoto"
                        name="uploadPhoto"
                        type="file"
                        // required
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

export default Addemployee;
