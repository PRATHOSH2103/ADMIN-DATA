
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbUsersGroup } from "react-icons/tb";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManageInterview = () => {

    const [search, setSearch] = useState("");
    const [interviews, setInterviews] = useState([]);

    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const token = localStorage.getItem("adminToken");


    const fetchInterviews = useCallback(async () => {
        try {
            const res = await axios.get(
                "http://localhost:4004/api/interviews",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setInterviews(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, [token]);

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);


    const handleDelete = async (id) => {
        // if (!window.confirm("Delete Interview?")) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this Interview !",
            icon: "warning",
            width: 100,
            heightAuto: false,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
        });
        
        if (!result.isConfirmed) return;

        try {
            await axios.delete(
                `http://localhost:4004/api/interviews/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.error("Interviewee Delete Successfully")
            fetchInterviews();

        } catch (err) {
            console.error("Delete error:", err);
        }
    };



    useEffect(() => {
        setCurrentIndex(0);
    }, [search]);

    const filteredData = interviews.filter((item) =>
        item.intervieweeName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div id="manage-lead">
            <div className="layout">
                <div className="main">

                    <div className="header">
                        <div id="student" onClick={() => navigate("/dashboard/schedule")}>
                            <TbUsersGroup />&nbsp; Schedule
                        </div>

                        <div id="center-letter">
                            Manage Interview
                        </div>

                        <div className="page" onClick={() => navigate("/dashboard")}>
                            <span>Interview</span>&nbsp;›&nbsp;
                            <span className="active">Manage Interview</span>
                        </div>
                    </div>

                    <div id="student-data">
                        <br />

                        <input
                            id="text"
                            type="search"
                            placeholder="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <br /><br />

                        <div className="table-box">
                            <table id="data">
                                <thead>
                                    <tr id="rows">
                                        <th>#</th>
                                        <th>Created</th>
                                        <th>Name</th>
                                        <th>Qualification</th>
                                        <th>YOP</th>
                                        <th>Mobile</th>
                                        <th>Location</th>
                                        <th>Job role</th>
                                        <th>FollowUp</th>
                                        <th>Schedule On</th>
                                        <th>Source</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody id="tbody">
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                NO DETAILS YET...
                                            </td>
                                        </tr>
                                    ) : (
                                        (() => {
                                            // const item = filteredData[currentIndex];

                                            // return (
                                            //     <tr key={item._id}>
                                            //         <td>{currentIndex + 1}</td>
                                            //         <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            //         <td>{item.intervieweeName}</td>
                                            //         <td>{item.qualification}</td>
                                            //         <td>{item.yearOfPassing}</td>
                                            //         <td>{item.phoneNumber}</td>
                                            //         <td>{item.location}</td>
                                            //         <td>{item.jobrole}</td>
                                            //         <td>{item.followUpStatus}</td>
                                            //         <td>{new Date(item.scheduleDate).toLocaleDateString()}</td>
                                            //         <td>{item.source}</td>

                                            const item = filteredData[currentIndex];

                                            if (!item) {
                                                return (
                                                    <tr>
                                                        <td colSpan="12" style={{ textAlign: "center" }}>
                                                            NO DETAILS YET...
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return (
                                                <tr key={item._id}>
                                                    <td>{currentIndex + 1}</td>
                                                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                                                    <td>{item.intervieweeName}</td>
                                                    <td>{item.qualification}</td>
                                                    <td>{item.yearOfPassing}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.jobrole}</td>
                                                    <td>{item.followUpStatus}</td>
                                                    <td>{item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString() : "-"}</td>
                                                    <td>{item.source}</td>
                                                    <td>
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/dashboard/schedule/${item._id}`)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(item._id)
                                                            }
                                                        >
                                                            Del
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })()
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
            </div>
        </div>
    );
};

export default ManageInterview;