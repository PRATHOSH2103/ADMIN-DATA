

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CreateCashOut = () => {

  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [type, setType] = useState("student");
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const url =
        type === "student"
          ? "http://localhost:4004/api/student-cash"
          : "http://localhost:4004/api/customer-cash";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDetails(res.data);
      setCurrentIndex(0);
    } catch (err) {
      alert("Failed to load records");
    }
  }, [token, type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = details.filter((item) => {
    const name =
      type === "student"
        ? item.studentId?.firstName
        : item.customerId?.clientName;

    return name?.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this cash-In?")) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this cash-In !",
      icon: "warning",
      width: 100,
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    const url =
      type === "student"
        ? `http://localhost:4004/api/student-cash/${id}`
        : `http://localhost:4004/api/customer-cash/${id}`;

    await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Cash-In deleted Successfully");
    fetchData();
  };


  const handleEdit = (id) => {
    navigate(`/dashboard/cash-in/${type}/${id}`);
  };

  const currentItem = filteredData[currentIndex];

  return (
    <div id="studentlist-form">
      <div className="header">
        <div id="studentThree" onClick={() => navigate("/dashboard/cash-out-receipts")}>
          <TbUsersGroup /> &nbsp; Manage Receipt
        </div>

        <div id="center-letter">
          Manage {type === "student" ? "Student" : "Customer"} Cash Records
        </div>


        <div className="cash-type">
          <label>
            <input
              type="radio"
              value="student"
              checked={type === "student"}
              onChange={(e) => setType(e.target.value)}
            />
            &nbsp; Student
          </label>

          <label>
            <input
              type="radio"
              value="customer"
              checked={type === "customer"}
              onChange={(e) => setType(e.target.value)}
            />
            &nbsp; Customer
          </label>
        </div>

      </div>
      <br />
      <div id="student-data">
        <br />

        <input
          id="text"
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentIndex(0);
          }}
        />

        <br />
        <br />

        <div id="studentdetails">
          <table id="data">
            <thead>
              <tr id="rows">
                <th>S.No</th>
                <th>Name</th>
                <th>Payment Type</th>
                <th>Paid Amount</th>
                <th>Remaining Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {!currentItem ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No {type === "student" ? "Student" : "Customer"} Cash Records
                    Found
                  </td>
                </tr>
              ) : (
                <tr key={currentItem._id}>
                  <td>{currentIndex + 1}</td>
                  <td>
                    {type === "student"
                      ? currentItem.studentId?.firstName
                      : currentItem.customerId?.clientName}
                  </td>
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
                      onClick={() => handleEdit(currentItem._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(currentItem._id)}
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

export default CreateCashOut;
