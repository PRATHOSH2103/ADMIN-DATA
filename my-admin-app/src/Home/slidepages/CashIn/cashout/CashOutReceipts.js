
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const CashOutReceipts = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    /*  FETCH BOTH  */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const [studentRes, customerRes] = await Promise.all([
                axios.get("http://localhost:4004/api/student-cash", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:4004/api/customer-cash", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const studentData = (studentRes.data || []).map((item) => ({
                ...item,
                type: "student",
                name: item.studentId?.firstName,
            }));

            const customerData = (customerRes.data || []).map((item) => ({
                ...item,
                type: "customer",
                name: item.customerId?.clientName,
            }));


            const combined = [...studentData, ...customerData].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setRecords(combined);
        } catch (err) {
            alert("Failed to load records");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /*  FILTER  */
    const filteredData = records.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
    );

    /*  DELETE  */
    const handleDelete = async (id, type) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            const url =
                type === "student"
                    ? `http://localhost:4004/api/student-cash/${id}`
                    : `http://localhost:4004/api/customer-cash/${id}`;

            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchData();
        } catch {
            alert("Delete failed");
        }
    };

    /*  EDIT  */
    const handleEdit = (id, type) => {
        navigate(`/dashboard/cash-in/${type}/${id}`);
    };

    const currentItem = filteredData[currentIndex];

    return (
        <div id="studentlist-form">
            <div className="header">
                <div id="studentone" onClick={() => navigate("/dashboard/cash-in")}>
                    <TbUsersGroup /> &nbsp; Create
                </div>

                <div id="center-letter">
                    Manage Cash-Out Receipts
                </div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Receipts</span>&nbsp;›&nbsp;
                    <span className="active">Cash-In</span>
                </div>
            </div>
           <br/>
            <div id="student-data">
                <br />

                <input
                    id="text"
                    type="search"
                    placeholder="Search by name..."
                    value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentIndex(0);
                    }}
                />

                <br /><br />

                <div id="studentdetails">
                    <table id="data">
                        <thead>
                            <tr id="rows">
                                <th>S.No</th>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Payment Type</th>
                                <th>Paid Amount</th>
                                <th>Remaining Amount</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        {/* <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td style={{ textTransform: "capitalize" }}>
                                            {item.type}
                                        </td>
                                        <td>{item.name || "-"}</td>
                                        <td>{item.paymentType}</td>
                                        <td>{item.paidAmount}</td>
                                        <td>{item.remainingAmount}</td>
                                        <td>
                                            {item.createdAt
                                                ? new Date(item.createdAt).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td>
                                            <button
                                                className="edit"
                                                onClick={() =>
                                                    handleEdit(item._id, item.type)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete"
                                                onClick={() =>
                                                    handleDelete(item._id, item.type)
                                                }
                                            >
                                                Del
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody> */}
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : !currentItem ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                <tr key={currentItem._id}>
                                    <td>{currentIndex + 1}</td>
                                    <td style={{ textTransform: "capitalize" }}>
                                        {currentItem.type}
                                    </td>
                                    <td>{currentItem.name || "-"}</td>
                                    <td>{currentItem.paymentType}</td>
                                    <td>{currentItem.paidAmount}</td>
                                    <td>{currentItem.remainingAmount}</td>
                                    <td>
                                        {currentItem.createdAt
                                            ? new Date(currentItem.createdAt).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>
                                        <button
                                            className="edit"
                                            onClick={() =>
                                                handleEdit(currentItem._id, currentItem.type)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete"
                                            onClick={() =>
                                                handleDelete(currentItem._id, currentItem.type)
                                            }
                                        >
                                            Del
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    &nbsp;

                    {filteredData.length > 0 && (
                        <div id="pre-nxt" >
                            <button
                                onClick={() => setCurrentIndex((prev) => prev - 1)}
                                disabled={currentIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                id="nxt"
                                onClick={() => setCurrentIndex((prev) => prev + 1)}
                                disabled={currentIndex === filteredData.length - 1}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CashOutReceipts;