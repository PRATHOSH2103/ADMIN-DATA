import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

const Addvendor = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const token = localStorage.getItem("adminToken");

    const [formData, setFormData] = useState({
        vendorName: "",
        vendorType: "",
        mobileNumber: "",
        email: "",
        address: "",
        currentBalance: "",
        paidAmount: "",
        remainingAmount: "",
        comment: ""
    });


    useEffect(() => {
        if (!isEdit) return;

        axios
            .get(`http://localhost:4004/api/vendor/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                const data = res.data;
                setFormData({
                    vendorName: data.vendorName || "",
                    vendorType: data.vendorType || "",
                    mobileNumber: data.mobileNumber || "",
                    email: data.email || "",
                    address: data.address || "",
                    currentBalance: data.currentBalance || "",
                    paidAmount: data.paidAmount || "",
                    remainingAmount: data.remainingAmount || "",
                    comment: data.comment || ""
                });
            })
            .catch(() => alert("Failed to load vendor"));
    }, [id, isEdit, token]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            const current = Number(updated.currentBalance || 0);
            const paid = Number(updated.paidAmount || 0);

            updated.remainingAmount =
                current - paid >= 0 ? current - paid : 0;

            return updated;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                currentBalance: Number(formData.currentBalance),
                paidAmount: Number(formData.paidAmount),
                remainingAmount: Number(formData.remainingAmount)
            };

            if (isEdit) {
                await axios.put(
                    `http://localhost:4004/api/vendor/${id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Vendor updated Successfully");
            } else {
                await axios.post(
                    "http://localhost:4004/api/vendor",
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Vendor added Successfully");
            }

            navigate("/dashboard/manage-vendor");

        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };



    return (

        <div id="student-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/manage-vendor")}><TbUsersGroup />&nbsp; Vendor List</div>
                <div id="center-letter">
                    {isEdit ? "Edit Vendor" : "Register Vendor "}
                </div>
                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Vendor </span>
                    &nbsp;
                    <span className="separator">›</span>
                    &nbsp;
                    <span className="active">Add Vendor</span>
                </div>
            </div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="vendorName">Vendor Name <span id="star">*</span></label>
                    <input
                        id="vendorName"
                        name="vendorName"
                        placeholder="Vendor Name"
                        required
                        value={formData.vendorName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="vendorName">Vendor Type <span id="star">*</span></label>
                    <select
                        name="vendorType"
                        required
                        value={formData.vendorType}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Service">Service</option>
                        <option value="Contractor">Contractor</option>
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number <span id="star">*</span></label>
                    <input
                        id="mobileNumber"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        required
                        value={formData.mobileNumber || ""}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="email">Email ID<span id="star">*</span></label>
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
                    <label htmlFor="currentBalance">Current Balance <span id="star">*</span></label>
                    <input
                        id="currentBalance"
                        name="currentBalance"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.currentBalance || ""}
                        onChange={handleChange}
                    />

                </div>


                <div className="form-group">
                    <label htmlFor="paidAmount">Paid Amount <span id="star">*</span></label>
                    <input
                        id="paidAmount"
                        name="paidAmount"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.paidAmount || ""}
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

                <div className="form-group full-width">
                    <label htmlFor="comment">Comment <span id="star">*</span></label>
                    <input
                        id="comment"
                        name="comment"
                        type="text"
                        required
                        value={formData.comment || ""}
                        onChange={handleChange}
                    >

                    </input>
                </div>
                <br />
                <div id="registerBtn"><button type="submit">{isEdit ? "Update" : "Submit"}</button></div>

            </form>
        </div>
    );
}

export default Addvendor;
