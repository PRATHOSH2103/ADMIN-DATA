
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ViewAttendance = () => {

    const token = localStorage.getItem("adminToken");

    const [details, setDetails] = useState([]);

    const [search, setSearch] = useState("");

    const navigate = useNavigate();



    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < filteredEmployee.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };




    const Getdata = useCallback(async () => {
        try {
            const res = await axios.get(
                "http://localhost:4004/api/attendance",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [token]);



    useEffect(() => {

        Getdata();

    }, [Getdata])


    const filteredEmployee = details.filter((item) => {
        const searchText = search.toLowerCase();

        return (
            item.employeeId?.firstName?.toLowerCase().includes(searchText)
        );
    });


    const handleDelete = async (id) => {
        // if (!window.confirm("Are you sure you want to delete this attendance?")) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this attendance !",
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
                `http://localhost:4004/api/attendance/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("Attendance deleted Successfully");
            Getdata();

            setCurrentIndex(0);
        } catch (err) {
            toast.error("Failed to delete attendance");
        }
    };





    return (
        <div id="studentlist-form">
            <div className="header">
                <div id="studenttwo" onClick={() => navigate("/dashboard/add-attendance")}>
                    <TbUsersGroup /> &nbsp; Add Attendance
                </div>

                <div id="center-letter">Manage Employee Attendance</div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Attendance</span>&nbsp;›&nbsp;
                    <span className="active">view Attendance</span>
                </div>
            </div>

            <br />

            <div id="student-data">
                <br />
                <input id="text" type="search" placeholder="search" value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                <br />
                <br />
                <div id="studentdetails">
                    <table id="data">
                        <thead>
                            <tr id="rows">
                                <th>S.No</th>
                                <th>firstName</th>
                                <th>Status</th>
                                <th>Permission</th>
                                <th>Leave</th>
                                <th>In-Date</th>
                                <th>Out-Date</th>
                                <th>In-Time</th>
                                <th>Out-Time</th>
                                <th>Comments</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="tbody">
                            {filteredEmployee.length === 0 || !filteredEmployee[currentIndex] ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        NO EMPLOYEES FOUND ADD ATTENDANCE ...
                                    </td>
                                </tr>
                            ) : (
                                <tr key={filteredEmployee[currentIndex]._id}>
                                    <td>{currentIndex + 1}</td>
                                    <td>{filteredEmployee[currentIndex].employeeId?.firstName}</td>
                                    <td>{filteredEmployee[currentIndex].statusWork}</td>
                                    <td>{filteredEmployee[currentIndex].permission ? "Yes" : "No"}</td>
                                    <td>{filteredEmployee[currentIndex].leave ? "Yes" : "No"}</td>
                                    <td>
                                        {filteredEmployee[currentIndex].inDate
                                            ? new Date(filteredEmployee[currentIndex].inDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>
                                        {filteredEmployee[currentIndex].outDate
                                            ? new Date(filteredEmployee[currentIndex].outDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{filteredEmployee[currentIndex].inTime || "-"}</td>
                                    <td>{filteredEmployee[currentIndex].outTime || "-"}</td>
                                    <td>{filteredEmployee[currentIndex].comments}</td>
                                    <td className="action-col">
                                        <button
                                            className="edit"
                                            onClick={() =>
                                                navigate(`/dashboard/add-attendance/${filteredEmployee[currentIndex]._id}`)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete"

                                            onClick={() => handleDelete(filteredEmployee[currentIndex]._id)}
                                        >
                                            Del
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>


                    </table>
                    <br />
                    <div id="pre-nxt">
                        <button onClick={handlePrevious} disabled={currentIndex === 0}>
                            Previous
                        </button>
                        <button id="nxt" onClick={handleNext} disabled={currentIndex === filteredEmployee.length - 1}>
                            Next
                        </button>
                    </div>



                </div>
            </div>


        </div >
    );
};

export default ViewAttendance;
