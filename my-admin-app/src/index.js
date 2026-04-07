
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./css/login.css";
import "./Home/dashborad-css/dashboard.css";

import Login from './components/login';
import Forgot from './components/forget';
import ResetPassword from './components/resetpassword';

import DashBoard from './Home/DashBoard';
import Dashboardhome from './Home/dashboardhome';
import AddStudent from './Home/slidepages/Addstudent';
import Addstudentlist from './Home/slidepages/Addstudentlist';
import Master from './Home/slidepages/master/Master';
import Addemployee from './Home/slidepages/AddEmployee';
import EmployeeId from './Home/slidepages/master/employeeId';
import Addemployeelist from './Home/slidepages/Addemployeelist';
import AddAttendance from './Home/slidepages/attandance/addAttendance';
import ViewAttendance from './Home/slidepages/attandance/viewAttendance';
import Addcustomer from './Home/slidepages/customer/Addcustomer';
import ViewCustomer from './Home/slidepages/customer/viewCustomer';
import InvoiceId from './Home/slidepages/master/InvoiceId';
import Invoice from './Home/slidepages/Billing/GST';
import NonGST from './Home/slidepages/Billing/NonGST';
import Addvendor from './Home/slidepages/vendor/Addvendor';
import ManageVendor from './Home/slidepages/vendor/ManageVendor';
import AddLeads from './Home/slidepages/AddLeads/AddLeads';
import ManageLeads from './Home/slidepages/AddLeads/ManageLeads';
import RescheduledList from './Home/slidepages/AddLeads/RescheduledList';
import BulkLeads from './Home/slidepages/AddLeads/BulkLeads';
import CreateCashIn from './Home/slidepages/CashIn/CreateCashIn';
import CreateCashOut from './Home/slidepages/CashIn/cashout/CreateCashOut';
import CashOutReceipts from './Home/slidepages/CashIn/cashout/CashOutReceipts';
import Schedule from './Home/slidepages/interview/Schedule';
import ManageInterview from './Home/slidepages/interview/ManageInterview';
import ManageReports from './Home/slidepages/Reports/ManageReports';
import CreateStaff from './Home/slidepages/master/createStaff';
import Admin from './Home/slidepages/master/Admin';
import CourseFess from './Home/slidepages/master/courseFess';


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeType from './Home/slidepages/master/EmployeeType';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>

    <ToastContainer
      position="top-center"
      autoClose={2000}
      theme="colored"
    />


    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<Forgot />} />
      <Route path="/forget/resetpassword" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/dashboard" element={<DashBoard />}>
        <Route index element={<Dashboardhome />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="add-student/:id" element={<AddStudent />} />
        <Route path="master" element={<Master />} />
        <Route path="add-student-list" element={<Addstudentlist />} />


        <Route path="add-employee" element={<Addemployee />} />
        <Route path="employee-Id" element={<EmployeeId />} />
        <Route path="add-employee/:id" element={<Addemployee />} />
        <Route path="add-employee-list" element={<Addemployeelist />} />

        <Route path="add-attendance" element={<AddAttendance />} />
        <Route path="view-attendance" element={<ViewAttendance />} />
        <Route path="attendance-list" element={<ViewAttendance />} />
        <Route path="add-attendance/:id" element={<AddAttendance />} />


        <Route path="add-customer" element={<Addcustomer />} />
        <Route path="view-customer" element={<ViewCustomer />} />
        <Route path="invoice-number" element={<InvoiceId />} />
        <Route path="add-customer/:id" element={<Addcustomer />} />


        <Route path="GST" element={<Invoice />} />
        <Route path="Non-GST" element={<NonGST />} />

        <Route path="add-vendor" element={<Addvendor />} />
        <Route path="manage-vendor" element={<ManageVendor />} />
        <Route path="add-vendor/:id" element={<Addvendor />} />


        <Route path="add-leads" element={<AddLeads />} />
        <Route path="manage-leads" element={<ManageLeads />} />
        <Route path="add-leads/:id" element={<AddLeads />} />
        <Route path="rescheduled-list" element={<RescheduledList />} />



        <Route path="bulk-leads" element={<BulkLeads />} />


        <Route path="cash-in" element={<CreateCashIn />} />
        <Route path="cash-out" element={<CreateCashOut />} />


        <Route path="cash-in" element={<CreateCashIn />} />
        <Route path="cash-in/:type/:id" element={<CreateCashIn />} />
        <Route path="cash-out" element={<CreateCashOut />} />
        <Route path="cash-out-receipts" element={<CashOutReceipts />} />


        <Route path="schedule" element={<Schedule />} />
        <Route path="manage-schedule" element={<ManageInterview />} />
        <Route path="/dashboard/schedule" element={<Schedule />} />
        <Route path="/dashboard/schedule/:id" element={<Schedule />} />

        <Route path="manage-reports" element={<ManageReports />} />


        <Route path="create-staff" element={<CreateStaff />} />
        <Route path="create-staff/:id" element={<CreateStaff />} />
        <Route path="admin" element={<Admin />} />
        <Route path="course-fees" element={<CourseFess />} />


        <Route path="employee-type" element={<EmployeeType />} />

      </Route>

    </Routes>
  </BrowserRouter>
);
