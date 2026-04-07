

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const StudentCashForm = ({ id }) => {

    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        studentId: "",
        currentBalance: "",
        paidAmount: "",
        remainingAmount: "",
        paymentType: "",
        comment: "",
    });

    /*  FETCH STUDENTS  */
    useEffect(() => {
        axios
            .get("http://localhost:4004/api/students", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setStudents(res.data))
            .catch(() => alert("Failed to load students"));
    }, [token]);

    /*  FETCH EDIT DATA  */
    useEffect(() => {
        if (!id) return;

        axios
            .get(`http://localhost:4004/api/student-cash/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;

                setFormData({
                    studentId: data.studentId?._id || data.studentId,
                    currentBalance: data.currentBalance || "",
                    paidAmount: data.paidAmount || "",
                    remainingAmount: data.remainingAmount || "",
                    paymentType: data.paymentType || "",
                    comment: data.comment || "",
                });
            })
            .catch(() => alert("Failed to load record"));
    }, [id, token]);

    /*  HANDLE CHANGE  */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            const current = Number(updated.currentBalance || 0);
            const paid = Number(updated.paidAmount || 0);

            updated.remainingAmount = current - paid >= 0 ? current - paid : 0;

            return updated;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                // UPDATE
                await axios.put(
                    `http://localhost:4004/api/student-cash/${id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Student Cash-In Updated Successfully ");
            } else {
                // CREATE
                await axios.post(
                    "http://localhost:4004/api/student-cash",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Student Cash-In Added Successfully ");
            }

            navigate("/dashboard/cash-out");
        } catch (err) {
            toast.error("Operation failed ");
        }
    };


    


    return (
        <form className="student-cashform" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Student Name <span id="star">*</span></label>
                <select id="customer-select"
                    name="studentId"
                    required
                    value={formData.studentId}
                    onChange={handleChange}
                >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student._id} value={student._id}>
                            {student.firstName}
                        </option>
                    ))}
                </select>
            </div>


            <div className="form-group">
                <label>Current Balance *</label>
                <input
                    type="number"
                    name="currentBalance"
                    required
                    min="0"
                    step="1"
                    value={formData.currentBalance}
                    onChange={handleChange}
                />
            </div>


            <div className="form-group">
                <label>Paid Amount *</label>
                <input
                    type="number"
                    name="paidAmount"
                    required
                    min="0"
                    step="1"
                    value={formData.paidAmount}
                    onChange={handleChange}
                />
            </div>


            <div className="form-group">
                <label>Remaining Amount *</label>
                <input
                    type="number"
                    name="remainingAmount"
                    value={formData.remainingAmount}
                    readOnly
                />
            </div>


            <div className="form-group">
                <label className="form-label">
                    Payment Type <span className="required">*</span>
                </label>
                <div className="cash-type">
                    <label className="radio-item">
                        <input
                            type="radio"
                            name="paymentType"
                            value="Cash"
                            checked={formData.paymentType === "Cash"}
                            onChange={handleChange}
                            required
                        />
                        <span>Cash</span>
                    </label>

                    <label className="radio-item">
                        <input
                            type="radio"
                            name="paymentType"
                            value="Bank"
                            checked={formData.paymentType === "Bank"}
                            onChange={handleChange}
                            required
                        />
                        <span>Bank</span>
                    </label>

                    <label className="radio-item">
                        <input
                            type="radio"
                            name="paymentType"
                            value="Online"
                            checked={formData.paymentType === "Online"}
                            onChange={handleChange}
                            required
                        />
                        <span>Online Pay</span>
                    </label>

                </div>
            </div>

            <div className="form-group">
                <label>Comment <span id="star">*</span></label>
                <input
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                />
            </div>

            <div id="registerBtn">
                <button type="submit">{id ? "Update" : "Submit"}</button>
            </div>
        </form >
    );
};

export default StudentCashForm;