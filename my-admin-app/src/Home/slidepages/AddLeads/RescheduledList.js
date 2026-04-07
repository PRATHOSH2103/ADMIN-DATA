
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbUsersGroup } from "react-icons/tb";

import Swal from "sweetalert2";

const RescheduledList = () => {


    const [search, setSearch] = useState("");
    const [leads, setLeads] = useState([]);

    const [employees, setEmployees] = useState([]);

    // const [fromDate, setFromDate] = useState("");
    // const [toDate, setToDate] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");



    /*  FETCH LEADS  */

    const fetchLeads = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:4004/api/leads", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Sort latest first
            const sortedLeads = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setLeads(sortedLeads);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    /*  DELETE  */

    const handleDelete = async (id) => {
        // if (!window.confirm("Delete Lead?")) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this Lead !",
            icon: "warning",
            width: 100,
            heightAuto: false,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
        });

        if (!result.isConfirmed) return;

        await axios.delete(`http://localhost:4004/api/leads/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        fetchLeads();
    };




    /*  FILTERED LEADS  */

    const filtered = leads.filter((item) =>

    (
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.yearOfPassing?.toLowerCase().includes(search.toLowerCase()) ||
        item.course?.toLowerCase().includes(search.toLowerCase())
    )
    );



    /* Reset index when filter changes */
    useEffect(() => {
        setCurrentIndex(0);
    }, [search]);

    /*  CURRENT LEAD  */

    const currentLead = filtered[currentIndex];

    /*  NEXT / PREV  */

    const goNext = () => {
        if (currentIndex < filtered.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };




    useEffect(() => {
        axios
            .get("http://localhost:4004/api/employee", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setEmployees(res.data))
            .catch(err => console.log(err));
    }, [token]);

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e._id === id);
        return emp ? `${emp.firstName} ${emp.lastName}` : id;
    };


    return (
        <div id="manage-lead">
            <div className="layout">

                <div className="main">
                    {/* PAGE TITLE */}
                    <div className="page-header">
                        <div id="student" onClick={() => navigate("/dashboard/add-leads")}>
                            <TbUsersGroup /> &nbsp; Leads
                        </div>

                        <div id="center-letter">Rescheduled Leads</div>

                        <div className="page" onClick={() => navigate("/dashboard")}>
                            <span>Leads</span>&nbsp;›&nbsp;
                            <span className="active">Rescheduled List</span>
                        </div>
                    </div>


                    {/* TABLE */}

                    <div id="student-data">
                        <br />
                        <input id="text" type="search" placeholder="search" value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                        <br />
                        <br />
                        <div className="table-box">
                            <div id="printArea">
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
                                            <th>Course</th>
                                            <th>FollowUp</th>
                                            <th>Sent</th>
                                            <th>Assign</th>
                                            <th>Source</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>


                                    <tbody id="tbody">
                                        {!currentLead ? (
                                            <tr>
                                                <td colSpan="13" style={{ textAlign: "center" }}>
                                                    NO DETAILS YET...
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={currentLead._id}>
                                                <td>{currentIndex + 1}</td>
                                                <td>{new Date(currentLead.date).toLocaleDateString()}</td>
                                                <td>{currentLead.name}</td>
                                                <td>{currentLead.qualification}</td>
                                                <td>{currentLead.yearOfPassing}</td>
                                                <td>{currentLead.phoneNumber}</td>
                                                <td>{currentLead.location}</td>
                                                <td>{currentLead.course}</td>
                                                <td>{currentLead.followUpStatus}</td>
                                                <td>{currentLead.detailsSent}</td>
                                                {/* <td>{currentLead.assignedTo}</td> */}
                                                <td>{getEmployeeName(currentLead.assignedTo)}</td>
                                                <td>{currentLead.source}</td>

                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/dashboard/add-leads/${currentLead._id}`)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button onClick={() => handleDelete(currentLead._id)}>
                                                        Del
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                    {/* <tbody id="tbody1">
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="13" style={{ textAlign: "center" }}>
                                                    NO DETAILS FOUND...
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((lead, index) => (
                                                <tr key={lead._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(lead.date).toLocaleDateString()}</td>
                                                    <td>{lead.name}</td>
                                                    <td>{lead.qualification}</td>
                                                    <td>{lead.yearOfPassing}</td>
                                                    <td>{lead.phoneNumber}</td>
                                                    <td>{lead.location}</td>
                                                    <td>{lead.course}</td>
                                                    <td>{lead.followUpStatus}</td>
                                                    <td>{lead.detailsSent}</td>
                                                    <td>{lead.assignedTo}</td>
                                                    <td>{lead.source}</td>

                                                    <td>
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/dashboard/add-leads/${lead._id}`)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button onClick={() => handleDelete(lead._id)}>
                                                            Del
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody> */}


                                </table>
                            </div>
                            <br />
                            <div id="pre-nxt">
                                <button disabled={currentIndex === 0} onClick={goPrev}>
                                    Previous
                                </button>
                                &nbsp;
                                &nbsp;
                                <button
                                    disabled={currentIndex === filtered.length - 1}
                                    onClick={goNext}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RescheduledList;













