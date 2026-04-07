import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const CustomerCashForm = ({id}) => {

    // const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        customerId: "",
        currentBalance: "",
        paidAmount: "",
        remainingAmount: "",
        paymentType: "",
        comment: "",
    });


    useEffect(() => {
        axios
            .get("http://localhost:4004/api/customer", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCustomers(res.data));
    }, [token]);


    useEffect(() => {
        if (!id) return;

        axios
            .get(`http://localhost:4004/api/customer-cash/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;

                setFormData({
                    customerId: data.customerId?._id || data.customerId,
                    currentBalance: data.currentBalance || "",
                    paidAmount: data.paidAmount || "",
                    remainingAmount: data.remainingAmount || "",
                    paymentType: data.paymentType || "",
                    comment: data.comment || "",
                });
            })
            .catch(() => alert("Failed to load record"));
    }, [id, token]);

    /* HANDLE CHANGE */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            updated.remainingAmount =
                Number(updated.currentBalance) - Number(updated.paidAmount);

            return updated;
        });
    };

    /* SUBMIT */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await axios.put(
                    `http://localhost:4004/api/customer-cash/${id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Customer Cash-In Updated Successfully");
            } else {
                await axios.post(
                    "http://localhost:4004/api/customer-cash",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Customer Cash-In Added Successfully");
            }


            navigate("/dashboard/cash-out");
        } catch (err) {
            toast.error("Save Failed");
        }
    };


    return (
        <form className="student-cashform" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Customer Name <span id="star">*</span></label>
                <select id="customer-select"
                    name="customerId"
                    required
                    value={formData.customerId}
                    onChange={handleChange}
                >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                            {customer.clientName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Current Balance <span id="star">*</span></label>
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
                <label>Paid Amount <span id="star">*</span></label>
                <input
                    type="number"
                    name="paidAmount"
                    required
                    value={formData.paidAmount}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Remaining Amount <span id="star">*</span></label>
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


            <div className="form-group full-width">
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
        </form>
    );
};

export default CustomerCashForm;














