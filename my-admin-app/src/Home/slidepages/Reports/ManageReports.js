

// import React, { useState } from 'react';
// import { TbUsersGroup } from "react-icons/tb";
// import { useNavigate } from 'react-router-dom';

// import { TbAlignBoxBottomCenterFilled } from "react-icons/tb";


// const ManageReports = () => {

//     const navigate = useNavigate();

//     const currentYear = new Date().getFullYear();
//     const [selectedYear, setSelectedYear] = useState(currentYear);

//     const reports = [
//         { title: "Total Amount by Students", amount: "Rs.0" },
//         { title: "Total Amount by Customers", amount: "Rs.0" },
//         { title: "Total Amount by CashIn", amount: "Rs.0" },
//         { title: "Total Amount In Cash Out", amount: "Rs.0" }
//     ];

//     return (
//         <div id="student-form">
//             <div className="header">
//                 <div id="student" onClick={() => navigate("/dashboard/cash-in")}>
//                     <TbUsersGroup />&nbsp; Create
//                 </div>

//                 <div id="center-letter">
//                     Manage Reports
//                 </div>

//                 <div className="form">
//                     <label>Year</label>&nbsp;&nbsp;
//                     <select
//                         style={{ width: "80px" }}
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(e.target.value)}
//                     >
//                         {Array.from({ length: 5 }, (_, i) => {
//                             const y = currentYear - i;
//                             return <option key={y}>{y}</option>;
//                         })}
//                     </select>
//                 </div>
//             </div>
//             <br/>
//             <div id="report">
//                 <div className="report-cards">
//                     {reports.map((item, index) => (
//                         <div className="report-card" key={index}>
//                             <div className="card-header">
//                                 <span>{item.title}</span>
//                                 <div className="tablericon">
//                                     <TbAlignBoxBottomCenterFilled />
//                                 </div>
//                             </div>

//                             <div className="card-amount">
//                                 {item.amount}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </div>
//     );
// }

// export default ManageReports;





















import React, { useEffect, useState, useCallback } from 'react';
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { TbAlignBoxBottomCenterFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

const ManageReports = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [reports, setReports] = useState([
        { title: "Total Amount by Students", amount: 0 },
        { title: "Total Amount by Customers", amount: 0 },
        { title: "Total Amount by CashIn", amount: 0 },
        { title: "Total Amount In Cash Out", amount: 0 }
    ]);



    const fetchReportData = useCallback(async () => {
        try {

            const [studentRes, customerRes] = await Promise.all([
                axios.get("http://localhost:4004/api/student-cash", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:4004/api/customer-cash", {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            const studentData = studentRes.data || [];
            const customerData = customerRes.data || [];

            const studentFiltered = studentData.filter(
                (item) => new Date(item.createdAt).getFullYear() === Number(selectedYear)
            );

            const customerFiltered = customerData.filter(
                (item) => new Date(item.createdAt).getFullYear() === Number(selectedYear)
            );

            const studentTotal = studentFiltered.reduce(
                (sum, item) => sum + Number(item.paidAmount || 0),
                0
            );

            const customerTotal = customerFiltered.reduce(
                (sum, item) => sum + Number(item.paidAmount || 0),
                0
            );

            const cashInTotal = studentTotal + customerTotal;

            const cashOutTotal =
                studentFiltered.reduce((sum, item) => sum + Number(item.remainingAmount || 0), 0) +
                customerFiltered.reduce((sum, item) => sum + Number(item.remainingAmount || 0), 0);

            setReports([
                { title: "Total Amount by Students", amount: studentTotal },
                { title: "Total Amount by Customers", amount: customerTotal },
                { title: "Total Amount by CashIn", amount: cashInTotal },
                { title: "Total Amount In Cash Out", amount: cashOutTotal }
            ]);

        } catch (err) {
            console.error("Report fetch failed");
        }
    }, [selectedYear, token]);
    

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);


    return (
        <div id="student-form">

            <div className="header">

                <div id="student" onClick={() => navigate("/dashboard/cash-in")}>
                    <TbUsersGroup />&nbsp; Create
                </div>

                <div id="center-letter">
                    Manage Reports
                </div>

                <div className="form">
                    <label>Year</label>&nbsp;&nbsp;

                    <select
                        style={{ width: "80px" }}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const y = currentYear - i;
                            return <option key={y}>{y}</option>;
                        })}
                    </select>
                </div>

            </div>

            <br />

            <div id="report">
                <div className="report-cards">

                    {reports.map((item, index) => (
                        <div className="report-card" key={index}>

                            <div className="card-header">
                                <span>{item.title}</span>

                                <div className="tablericon">
                                    <TbAlignBoxBottomCenterFilled />
                                </div>
                            </div>

                            <div className="card-amount">
                                Rs.{item.amount}
                            </div>

                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}

export default ManageReports;