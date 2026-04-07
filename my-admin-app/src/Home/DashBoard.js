import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { RiAddBoxLine } from "react-icons/ri";
import { FaListUl } from "react-icons/fa6";
import { CgCalendarDates } from "react-icons/cg";
import { IoReceiptSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaFileInvoice } from "react-icons/fa";
import { FaRegIdCard } from "react-icons/fa6";
import { FaBookReader } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import TopBar from './Topbar';

import { toast } from "react-toastify";


const DashBoard = () => {

    const navigate = useNavigate()

    const [openMenu, setOpenMenu] = useState(null);

    const [user, setUser] = useState(null);


    const [sidebarOpen, setSidebarOpen] = useState(true);


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);


    useEffect(() => {
        const handleUserUpdate = () => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser);
        };

        window.addEventListener("userUpdated", handleUserUpdate);

        return () => {
            window.removeEventListener("userUpdated", handleUserUpdate);
        };
    }, []);


    const firstLetter = user?.name?.[0]?.toUpperCase() || "?";

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    return (
        <>
            <div id="Dash">
                <div id="dash-left" className={sidebarOpen ? "" : "closed"}>
                    <img id="logo" src={require("../Home/kitkat logo1.jpg")} alt="logo" />
                    <br />
                    <div className="user-card">
                        <div className="avatar-wrapper">
                            <div className="avatar">{firstLetter}</div>
                            <span className="status-dot"></span>
                        </div>
                        <span className="role">&nbsp;  {user?.name}</span>
                    </div>


                    <div className="sidebar">

                        <div className="menu-header" onClick={() => toggleMenu("student")}>
                            <span><FaUser /> &nbsp; Student Info</span>
                            <span className={`arrow ${openMenu === "student" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "student" && (
                            <>
                                <NavLink to="/dashboard/add-student" className="menu-item">
                                    <RiAddBoxLine /> Add Student
                                </NavLink>

                                <NavLink to="/dashboard/add-employee" className="menu-item">
                                    <RiAddBoxLine /> Add Employee
                                </NavLink>

                                <NavLink to="/dashboard/add-student-list" className="menu-item">
                                    <FaListUl />Student List
                                </NavLink>
                                <NavLink to="/dashboard/add-employee-list" className="menu-item">
                                    <FaListUl />Employee List
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Attandance")}>
                            <span><CgCalendarDates /> &nbsp; Attandance</span>
                            <span className={`arrow ${openMenu === "Attandance" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Attandance" && (
                            <>
                                <NavLink to="/dashboard/add-attendance" className="menu-item">
                                    <RiAddBoxLine />Add Attandance
                                </NavLink>
                                <NavLink to="/dashboard/view-attendance" className="menu-item">
                                    <FaListUl />View Attandance
                                </NavLink>
                            </>
                        )}

                        <div className="menu-header" onClick={() => toggleMenu("Customer")}>
                            <span><FaUser /> &nbsp; Customer</span>
                            <span className={`arrow ${openMenu === "Customer" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Customer" && (
                            <>
                                <NavLink to="/dashboard/add-customer" className="menu-item">
                                    <RiAddBoxLine />Add Customer
                                </NavLink>
                                <NavLink to="/dashboard/view-customer" className="menu-item">
                                    <FaListUl />Customer Attandance
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Vendors")}>
                            <span><FaUser /> &nbsp; Vendors</span>
                            <span className={`arrow ${openMenu === "Vendors" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Vendors" && (
                            <>
                                <NavLink to="/dashboard/add-vendor" className="menu-item">
                                    <RiAddBoxLine /> Add Vendors
                                </NavLink>
                                <NavLink to="/dashboard/manage-vendor" className="menu-item">
                                    <FaListUl />Manage Vendors
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Leads")}>
                            <span><FaUser /> &nbsp; Leads</span>
                            <span className={`arrow ${openMenu === "Leads" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Leads" && (
                            <>
                                <NavLink to="/dashboard/add-leads" className="menu-item">
                                    <RiAddBoxLine /> Add Leads
                                </NavLink>
                                <NavLink to="/dashboard/manage-leads" className="menu-item">
                                    <FaListUl />Manage Leads
                                </NavLink>
                                <NavLink to="/dashboard/rescheduled-list" className="menu-item">
                                    <FaListUl />Rescheduled List
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Receipt")}>
                            <span><IoReceiptSharp /> &nbsp; Receipt</span>
                            <span className={`arrow ${openMenu === "Receipt" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Receipt" && (
                            <>
                                <NavLink to="/dashboard/cash-in" className="menu-item">
                                    <FaListUl />Cash-In
                                </NavLink>
                                <NavLink to="/dashboard/cash-out" className="menu-item">
                                    <FaListUl />Cash-Out
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Interview")}>
                            <span><CgCalendarDates /> &nbsp; Interview</span>
                            <span className={`arrow ${openMenu === "Interview" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Interview" && (
                            <>
                                <NavLink to="/dashboard/schedule" className="menu-item">
                                    <RiAddBoxLine />Schedule
                                </NavLink>
                                <NavLink to="/dashboard/manage-schedule" className="menu-item">
                                    <FaListUl />Manage Interview
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Reports")}>
                            <span><TbReportSearch /> &nbsp; Reports</span>
                            <span className={`arrow ${openMenu === "Reports" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Reports" && (
                            <>
                                {/* <div className="menu-item"><FaListUl />Manage Reports</div> */}
                                <NavLink to="/dashboard/manage-reports" className="menu-item">
                                    <FaListUl />Manage Reports
                                </NavLink>

                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Billing")}>
                            <span><FaMoneyBill /> &nbsp; Billing</span>
                            <span className={`arrow ${openMenu === "Reports" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Billing" && (
                            <>
                                <NavLink to="/dashboard/GST" className="menu-item">
                                    <IoReceiptSharp />GST
                                </NavLink>
                                <NavLink to="/dashboard/Non-GST" className="menu-item">
                                    <IoReceiptSharp />Non-GST
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Master")}>
                            <span><FaBagShopping />&nbsp; Master</span>
                            <span className={`arrow ${openMenu === "Master" ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </div>

                        {openMenu === "Master" && (
                            <>

                                <NavLink to="/dashboard/invoice-number" className="menu-item">
                                    <FaFileInvoice />Invoice No
                                </NavLink>
                                <NavLink to="/dashboard/master" className="menu-item">
                                    <FaRegIdCard /> Student Id
                                </NavLink>
                                <NavLink to="/dashboard/employee-Id" className="menu-item">
                                    <FaRegIdCard /> Employee Id
                                </NavLink>
                                <NavLink to="/dashboard/create-staff" className="menu-item">
                                    <FaBookReader />Create Staff
                                </NavLink>
                                <NavLink to="/dashboard/course-fees" className="menu-item">
                                    <FaBookReader />Course Fess
                                </NavLink>
                                <NavLink to="/dashboard/employee-type" className="menu-item">
                                    <FaUser /> Employee Type
                                </NavLink>
                                <NavLink to="/dashboard/admin" className="menu-item">
                                    <FaBookReader />Admins
                                </NavLink>
                            </>
                        )}


                        <div className="menu-header" onClick={() => toggleMenu("Logout")}>
                            <span onClick={() => {
                                localStorage.removeItem("user");
                                toast.success("Logged out");
                                setTimeout(() => {
                                    navigate("/login");
                                }, 1000);

                            }}
                            ><IoLogOut />&nbsp; Logout</span>
                        </div>

                    </div>

                </div>

                <br />

                {/* dashboard right */}

                {/* <div id="dash-right">
                    <TopBar />
                    <Outlet />
                </div> */}
                <div id="dash-right" className={sidebarOpen ? "" : "full"}>

                    {/* Pass toggle function */}
                    <TopBar setSidebarOpen={setSidebarOpen} />

                    <Outlet />

                </div>

            </div>
        </>
    );
}

export default DashBoard;
