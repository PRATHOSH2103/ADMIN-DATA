
import React, { useCallback, useEffect,  useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import * as XLSX from "xlsx";

import Swal from "sweetalert2";
import { toast } from "react-toastify";


const API = "http://localhost:4004/api";

const ManageLeads = () => {


    // const [search, setSearch] = useState("");
    // const [leads, setLeads] = useState([]);
    // const [showFilter, setShowFilter] = useState(false);

    // const [fromDate, setFromDate] = useState("");
    // const [toDate, setToDate] = useState("");

    // const [currentIndex, setCurrentIndex] = useState(0);

    // const [employees, setEmployees] = useState([]);

    // const navigate = useNavigate();
    // const token = localStorage.getItem("adminToken");


    // // /* QUICK FILTER FUNCTIONS  */

    // const setToday = () => {
    //     const today = new Date().toISOString().split("T")[0];
    //     setFromDate(today);
    //     setToDate(today);
    // };

    // const setThisWeek = () => {
    //     const now = new Date();
    //     const first = new Date(now.setDate(now.getDate() - now.getDay()));
    //     const last = new Date();
    //     last.setDate(first.getDate() + 6);

    //     setFromDate(first.toISOString().split("T")[0]);
    //     setToDate(last.toISOString().split("T")[0]);
    // };

    // const setLastWeek = () => {
    //     const now = new Date();
    //     const first = new Date(now.setDate(now.getDate() - now.getDay() - 7));
    //     const last = new Date(first);
    //     last.setDate(first.getDate() + 6);

    //     setFromDate(first.toISOString().split("T")[0]);
    //     setToDate(last.toISOString().split("T")[0]);
    // };

    // const setThisMonth = () => {
    //     const now = new Date();
    //     const first = new Date(now.getFullYear(), now.getMonth(), 1);
    //     const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    //     setFromDate(first.toISOString().split("T")[0]);
    //     setToDate(last.toISOString().split("T")[0]);
    // };

    // const setLastMonth = () => {
    //     const now = new Date();
    //     const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    //     const last = new Date(now.getFullYear(), now.getMonth(), 0);

    //     setFromDate(first.toISOString().split("T")[0]);
    //     setToDate(last.toISOString().split("T")[0]);
    // };

    // const setThisYear = () => {
    //     const year = new Date().getFullYear();
    //     setFromDate(`${year}-01-01`);
    //     setToDate(`${year}-12-31`);
    // };

    // const setLastYear = () => {
    //     const year = new Date().getFullYear() - 1;
    //     setFromDate(`${year}-01-01`);
    //     setToDate(`${year}-12-31`);
    // };

    // const clearFilter = () => {
    //     setFromDate("");
    //     setToDate("");
    // };



    // /*  FETCH LEADS  */

    // const fetchLeads = useCallback(async () => {
    //     try {
    //         const res = await axios.get("http://localhost:4004/api/leads", {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         // Sort latest first
    //         // const sortedLeads = res.data.sort(
    //         //     (a, b) => new Date(b.date) - new Date(a.date)
    //         // );
    //         // setLeads(sortedLeads);


    //         setLeads(res.data);
    //         setCurrentIndex(0);


    //     } catch (err) {
    //         console.error(err);
    //     }
    // }, [token]);




    // useEffect(() => {
    //     fetchLeads();
    // }, [fetchLeads]);

    // /*  DELETE  */

    // const handleDelete = async (id) => {
    //     // if (!window.confirm("Are you sure you want to delete this lead?")) return;

    //     const result = await Swal.fire({
    //         title: "Are you sure?",
    //         text: "You want to delete this Lead !",
    //         icon: "warning",
    //         width: 100,
    //         heightAuto: false,
    //         showCancelButton: true,
    //         confirmButtonText: "Yes, delete it!",
    //         confirmButtonColor: "#e74c3c",
    //         cancelButtonColor: "#6c757d",
    //     });

    //     if (!result.isConfirmed) return;

    //     try {
    //         const token = localStorage.getItem("adminToken");

    //         await axios.delete(`http://localhost:4004/api/leads/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         setLeads((prev) => prev.filter((v) => v._id !== id));
    //         setCurrentIndex(0);

    //         toast.success("Lead deleted Successfully");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Delete failed");
    //     }
    // };


    // /*  DATE FILTER  */



    // const isWithinDateRange = (date) => {
    //     if (!date) return true;

    //     const leadDate = new Date(date);

    //     if (isNaN(leadDate)) return true;

    //     if (!fromDate && !toDate) return true;

    //     const from = fromDate ? new Date(fromDate) : null;
    //     const to = toDate ? new Date(toDate) : null;

    //     if (from && leadDate < from) return false;
    //     if (to && leadDate > new Date(to.setHours(23, 59, 59, 999)))
    //         return false;

    //     return true;
    // };

    // /*  FILTERED LEADS  */

    // const filtered = leads.filter((item) =>
    //     isWithinDateRange(item.date) &&
    //     (
    //         item.name?.toLowerCase().includes(search.toLowerCase()) ||
    //         item.yearOfPassing?.toLowerCase().includes(search.toLowerCase()) ||
    //         item.course?.toLowerCase().includes(search.toLowerCase())
    //     )
    // );



    // /* Reset index when filter changes */
    // useEffect(() => {
    //     setCurrentIndex(0);
    // }, [search, fromDate, toDate]);

    // /*  CURRENT LEAD  */

    // const currentLead = filtered[currentIndex];

    // /*  NEXT / PREV  */

    // // const goNext = () => {
    // //     if (currentIndex < filtered.length - 1) {
    // //         setCurrentIndex(currentIndex + 1);
    // //     }
    // // };

    // // const goPrev = () => {
    // //     if (currentIndex > 0) {
    // //         setCurrentIndex(currentIndex - 1);
    // //     }
    // // };



    // const printRef = useRef();


    // const handlePrint = () => {
    //     const printContents = document.getElementById("printArea").innerHTML;

    //     const newWindow = window.open("", "", "width=1200,height=800");

    //     newWindow.document.write(`
    //     <html>
    //     <head>
    //         <title>KITKAT SOFTWARE</title>
    //         <style>
    //             @page {
    //                 size: A4 landscape;
    //                 margin: 15mm;
    //             }

    //             body {
    //                 margin: 0;
    //                 padding: 30px;
    //                 font-family: Arial, sans-serif;
    //             }

    //             table {
    //                 width: 100%;
    //                 border-collapse: collapse;
    //                 table-layout: fixed;
    //                 font-size: 12px;
    //             }

    //             th, td {
    //                 border: 1px solid black;
    //                 padding: 6px;
    //                 text-align: center;
    //                 word-break: break-word;
    //             }

    //             th {
    //                 background: #f2f2f2;
    //                 font-weight: bold;
    //             }

    //             th:last-child,
    //             td:last-child {
    //                 display: none;
    //             }
    //         </style>
    //     </head>
    //     <body>
    //         ${printContents}
    //     </body>
    //     </html>
    // `);

    //     newWindow.document.close();
    //     newWindow.focus();
    //     newWindow.print();
    //     newWindow.close();
    // };




    // const handleExcelExport = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(filtered);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    //     XLSX.writeFile(workbook, "Leads.xlsx");
    // };




    // const handleSampleDownload = () => {
    //     const sampleData = [
    //         {
    //             Name: "John Doe",
    //             Qualification: "B.Sc",
    //             YOP: "2022",
    //             Mobile: "9876543210",
    //             Location: "Chennai",
    //             Course: "Full Stack",
    //             FollowUp: "Interested",
    //             Sent: "Yes",
    //             Assign: "John",
    //             Source: "Website"
    //         },
    //         {
    //             Name: "Priya",
    //             Qualification: "BCA",
    //             YOP: "2023",
    //             Mobile: "9123456780",
    //             Location: "Coimbatore",
    //             Course: "Python",
    //             FollowUp: "Pending",
    //             Sent: "No",
    //             Assign: "Priya",
    //             Source: "Instagram"
    //         }
    //     ];

    //     const worksheet = XLSX.utils.json_to_sheet(sampleData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Leads");

    //     XLSX.writeFile(workbook, "Sample_Leads.xlsx");
    // };



    // useEffect(() => {
    //     axios
    //         .get("http://localhost:4004/api/employee", {
    //             headers: { Authorization: `Bearer ${token}` }
    //         })
    //         .then(res => setEmployees(res.data))
    //         .catch(err => console.log(err));
    // }, [token]);

    // const getEmployeeName = (id) => {
    //     const emp = employees.find(e => e._id === id);
    //     return emp ? `${emp.firstName} ${emp.lastName}` : id;
    // };


    const [search, setSearch] = useState("");
    const [leads, setLeads] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    /* FORMAT DATE */


    /* QUICK FILTERS */
    const setToday = () => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
    };

    /* WEEK FILTERS */

    const setThisWeek = () => {
        const now = new Date();
        const first = new Date(now.setDate(now.getDate() - now.getDay()));
        const last = new Date(first);
        last.setDate(first.getDate() + 6);

        setFromDate(first.toISOString().split("T")[0]);
        setToDate(last.toISOString().split("T")[0]);
    };

    const setLastWeek = () => {
        const now = new Date();
        const first = new Date(now.setDate(now.getDate() - now.getDay() - 7));
        const last = new Date(first);
        last.setDate(first.getDate() + 6);

        setFromDate(first.toISOString().split("T")[0]);
        setToDate(last.toISOString().split("T")[0]);
    };

    /* MONTH FILTER */

    const setLastMonth = () => {
        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const last = new Date(now.getFullYear(), now.getMonth(), 0);

        setFromDate(first.toISOString().split("T")[0]);
        setToDate(last.toISOString().split("T")[0]);
    };

    /* YEAR FILTER */

    const setThisYear = () => {
        const year = new Date().getFullYear();
        setFromDate(`${year}-01-01`);
        setToDate(`${year}-12-31`);
    };

    const setLastYear = () => {
        const year = new Date().getFullYear() - 1;
        setFromDate(`${year}-01-01`);
        setToDate(`${year}-12-31`);
    };

    const setThisMonth = () => {
        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth(), 1);
        const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setFromDate(first.toISOString().split("T")[0]);
        setToDate(last.toISOString().split("T")[0]);
    };

    const clearFilter = () => {
        setFromDate("");
        setToDate("");
    };

    /* FETCH LEADS */
    const fetchLeads = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/leads`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLeads(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    /* FETCH EMPLOYEES */
    useEffect(() => {
        axios
            .get(`${API}/employee`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setEmployees(res.data))
            .catch((err) => console.log(err));
    }, [token]);

    /* GET EMPLOYEE NAME */
    const getEmployeeName = (id) => {
        const emp = employees.find((e) => e._id === id);
        return emp ? `${emp.firstName} ${emp.lastName}` : "-";
    };

    /* DELETE LEAD */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Lead?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#e74c3c",
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${API}/leads/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLeads((prev) => prev.filter((v) => v._id !== id));
            toast.success("Lead deleted successfully");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    /* DATE FILTER */
    const isWithinDateRange = (date) => {
        if (!date) return true;

        const leadDate = new Date(date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && leadDate < from) return false;
        if (to && leadDate > new Date(to.setHours(23, 59, 59, 999))) return false;

        return true;
    };

    /* FILTERED LEADS */
    const filtered = leads.filter((item) => {
        const q = search.toLowerCase();

        return (
            isWithinDateRange(item.date) &&
            (item.name?.toLowerCase().includes(q) ||
                item.yearOfPassing?.toLowerCase().includes(q) ||
                item.course?.toLowerCase().includes(q))
        );
    });

    /* EXPORT EXCEL */
    const handleExcelExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filtered);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
        XLSX.writeFile(workbook, "Leads.xlsx");
    };

    /* SAMPLE DOWNLOAD */
    const handleSampleDownload = () => {
        const sampleData = [
            {
                Name: "John Doe",
                Qualification: "B.Sc",
                YOP: "2022",
                Mobile: "9876543210",
                Location: "Chennai",
                Course: "Full Stack",
                FollowUp: "Interested",
                Sent: "Yes",
                Assign: "John",
                Source: "Website",
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Leads");

        XLSX.writeFile(workbook, "Sample_Leads.xlsx");
    };

    /* PRINT */
    const handlePrint = () => {
        const printContents = document.getElementById("printArea").innerHTML;

        const newWindow = window.open("", "", "width=1200,height=800");

        newWindow.document.write(`
       <html>
        <head>
            <title>KITKAT SOFTWARE</title>
            <style>
                @page {
                    size: A4 landscape;
                    margin: 15mm;
                }

                body {
                    margin: 0;
                    padding: 30px;
                    font-family: Arial, sans-serif;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    font-size: 12px;
                }

                th, td {
                    border: 1px solid black;
                    padding: 6px;
                    text-align: center;
                    word-break: break-word;
                }

                th {
                    background: #f2f2f2;
                    font-weight: bold;
                }

                th:last-child,
                td:last-child {
                    display: none;
                }
            </style>
        </head>
        <body>
            ${printContents}
        </body>
        </html>
    `);

        newWindow.document.close();
        newWindow.print();
    };



    return (
        <div id="manage-lead">
            <div className="layout">

                <div className="main">
                    <div className="page-header">
                        <h4 id="h4">Manage Leads</h4>

                        <div className="action-buttons">
                            <button onClick={() => navigate("/dashboard/add-leads")}>Add Leads + </button>

                            <button onClick={() => navigate("/dashboard/bulk-leads")}>
                                Bulk Data
                            </button>
                            {/* <button>Sample</button> */}
                            <button onClick={handleSampleDownload}>
                                Sample
                            </button>

                            <button onClick={() => setShowFilter(!showFilter)}>
                                Filter
                            </button>
                            {/* <button>Excel</button> */}
                            <button type="button" onClick={handleExcelExport}>
                                Excel
                            </button>

                            <button onClick={handlePrint}>Print</button>
                        </div>
                    </div>

                    {/* FILTER SECTION */}

                    {showFilter && (
                        <div className="filter-box">

                            <div className="date-section">
                                <div className="date-field">
                                    <label>From :</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>

                                <div className="date-field">
                                    <label>To :</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="quick-buttons">
                                <button onClick={setToday}>Today</button>
                                <button onClick={setThisWeek}>This Week</button>
                                <button onClick={setLastWeek}>Last Week</button>
                                <button onClick={setThisMonth}>This Month</button>
                                <button onClick={setLastMonth}>Last Month</button>
                                <button onClick={setThisYear}>This Year</button>
                                <button onClick={setLastYear}>Last Year</button>
                                <button onClick={clearFilter}>Clear</button>
                            </div>

                        </div>
                    )}


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





                                    <tbody>
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
                                                    <td>
                                                        {lead.date
                                                            ? new Date(lead.date).toLocaleDateString()
                                                            : "-"}
                                                    </td>
                                                    <td>{lead.name}</td>
                                                    <td>{lead.qualification}</td>
                                                    <td>{lead.yearOfPassing}</td>
                                                    <td>{lead.phoneNumber}</td>
                                                    <td>{lead.location}</td>
                                                    <td>{lead.course}</td>
                                                    <td>{lead.followUpStatus}</td>
                                                    <td>{lead.detailsSent}</td>
                                                    {/* <td>{lead.assignedTo}</td> */}
                                                    <td>{getEmployeeName(lead.assignedTo)}</td>
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
                                    </tbody>

                                </table>
                            </div>
                            <br />
                            {/* <div id="pre-nxt">
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManageLeads;










