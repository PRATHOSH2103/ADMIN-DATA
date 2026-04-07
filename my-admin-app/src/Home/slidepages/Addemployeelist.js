import axios from "axios";
import { useEffect, useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Swal from "sweetalert2";


const Addemployeelist = () => {
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



    const Getdata = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                "http://localhost:4004/api/employee",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("GET RESPONSE:", res.data);
            setDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {

        Getdata();

    }, [])



    const filteredEmployee = details.filter((item) => {
        const searchText = search.toLowerCase();

        return (
            item.firstName?.toLowerCase().includes(searchText) ||
            item.email?.toLowerCase().includes(searchText) ||
            item.employeeId?.toLowerCase().includes(searchText) ||
            item.designation?.toLowerCase().includes(searchText)
        );
    })

    const handleDelete = async (id) => {
        // if (!window.confirm("Are you sure you want to delete this employee?")) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this employee !",
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
            const token = localStorage.getItem("adminToken");

            await axios.delete(`http://localhost:4004/api/employee/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDetails(prev => prev.filter(item => item._id !== id));

            setCurrentIndex(0);

            toast.success("Employee Deleted Successfully");
        } catch (error) {
            console.error(error);
            toast.error("Employee Delete Failed");
        }
    };



    return (
        <div id="studentlist-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/add-employee")}>
                    <TbUsersGroup /> &nbsp; Add Employee
                </div>

                <div id="center-letter">Manage Employee Data</div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Student Info</span>&nbsp;›&nbsp;
                    <span className="active">Employee List</span>
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
                                <th>s.no</th>
                                <th>Id</th>
                                <th>firstName</th>
                                <th>Email</th>
                                <th>DOB</th>
                                <th>Contact</th>
                                <th>Designation</th>
                                <th>DOJ</th>
                                <th>Salary</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="tbody">
                            {filteredEmployee.length === 0 || !filteredEmployee[currentIndex] ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        NO EMPLOYEES FOUND ADD EMPLOYEES ...
                                    </td>
                                </tr>
                            ) : (
                                <tr key={filteredEmployee[currentIndex]._id}>
                                    <td>{currentIndex + 1}</td>
                                    <td>{filteredEmployee[currentIndex].employeeId}</td>
                                    <td>{filteredEmployee[currentIndex].firstName}</td>
                                    <td>{filteredEmployee[currentIndex].email}</td>
                                    <td>
                                        {filteredEmployee[currentIndex].dob
                                            ? new Date(filteredEmployee[currentIndex].dob).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{filteredEmployee[currentIndex].contactNumber}</td>
                                    <td>{filteredEmployee[currentIndex].designation}</td>
                                    <td>
                                        {filteredEmployee[currentIndex].dateOfJoining
                                            ? new Date(filteredEmployee[currentIndex].dateOfJoining).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{filteredEmployee[currentIndex].salary}</td>
                                    <td className="action-col">
                                        <button
                                            className="edit"
                                            onClick={() =>
                                                navigate(`/dashboard/add-employee/${filteredEmployee[currentIndex]._id}`)
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

export default Addemployeelist;