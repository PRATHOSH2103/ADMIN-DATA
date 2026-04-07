
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoReceiptSharp } from "react-icons/io5";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { toast } from "react-toastify";

const Addcustomer = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const isEdit = Boolean(id);

    const location = useLocation();

    const invoiceFromMaster = location.state?.invoiceId;


    const token = localStorage.getItem("adminToken");

    const [formData, setFormData] = useState({
        clientName: "",
        address: "",
        contactNumber: "",
        date: "",
        state: "",
        InvoiceNo: "",
        GSTIN: "",

    });

    useEffect(() => {
        if (!isEdit && invoiceFromMaster) {
            setFormData(prev => ({
                ...prev,
                InvoiceNo: invoiceFromMaster
            }));
        }
    }, [invoiceFromMaster, isEdit]);


    useEffect(() => {
        if (!isEdit || !id) return;

        axios.get(`http://localhost:4004/api/customer/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setFormData({
                    clientName: res.data.clientName || "",
                    address: res.data.address || "",
                    contactNumber: res.data.contactNumber || "",
                    date: res.data.date?.slice(0, 10) || "",
                    state: res.data.state || "",
                    InvoiceNo: res.data.InvoiceNo || "",
                    GSTIN: res.data.GSTIN || ""
                });
            })
            .catch(() => alert("Failed to load customer"));
    }, [id, isEdit, token]);
    ;

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

        const payload = { ...formData };
        delete payload.InvoiceNo;

        try {
            let res;

            if (isEdit) {
                res = await axios.put(
                    `http://localhost:4004/api/customer/${id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Customer Updated Successfully");
                navigate("/dashboard/view-customer")
            } else {
                res = await axios.post(
                    "http://localhost:4004/api/customer",
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Customer saved Successfully");
                navigate("/dashboard/view-customer", {
                    state: {
                        customerId: res.data._id,
                        InvoiceNo: res.data.InvoiceNo,
                        GSTIN: res.data.GSTIN,
                        date: res.data.date
                    }
                });
            }

        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.message || "Failed to save customer");
        }
    };




    return (
        <div id="student-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/GST")}>
                    <IoReceiptSharp />&nbsp; GST Invoice
                </div>
                <div id="center-letter">
                    {isEdit ? "Edit Customer" : "Register Customer"}
                </div>
                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Customer </span>&nbsp;›&nbsp;
                    <span className="active">Add Customer</span>
                </div>
            </div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>client Name <span id="star">*</span></label>
                    <input
                        name="clientName"
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={handleChange}
                    >

                    </input>
                </div>

                <div className="form-group">
                    <label>address <span id="star">*</span></label>
                    <input
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                    >
                    </input>
                </div>


                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number <span id="star">*</span></label>
                    <input
                        id="contactNumber"
                        name="contactNumber"
                        type="text"
                        placeholder="Contact Number"
                        required
                        value={formData.contactNumber || ""}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="date">Date <span id="star">*</span></label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        required
                        value={formData.date ? formData.date.slice(0, 10) : ""}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="state">State <span id="star">*</span></label>
                    <select
                        id="state"
                        name="state"
                        required
                        value={formData.state || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="West Bengal">Others</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="InvoiceNo">Invoice No <span id="star">*</span></label>
                    <input
                        id="InvoiceNo"
                        name="InvoiceNo"
                        type="text"
                        readOnly
                        value={formData.InvoiceNo || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="GSTIN">GST IN <span id="star">*</span></label>
                    <input
                        id="GSTIN"
                        name="GSTIN"
                        type="text"
                        required
                        value={formData.GSTIN || ""}
                        // onChange={handleChange}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            setFormData({ ...formData, GSTIN: value });
                        }}
                    />
                </div>
                <br />
                <br />
                <div id="registerBtn"><button type="submit">{isEdit ? "Update" : "Submit"}</button></div>

            </form>
        </div>
    );
};

export default Addcustomer;

