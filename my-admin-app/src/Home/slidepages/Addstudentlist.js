import axios from "axios";
import { useEffect, useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Addstudentlist = () => {
    const [details, setDetails] = useState([]);

    const [search, setSearch] = useState("");


    const navigate = useNavigate();


    const handleDelete = async (id) => {
        // if (!window.confirm("Are you sure you want to delete this student?")) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this student !",
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

            await axios.delete(`http://localhost:4004/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDetails(prev => prev.filter(item => item._id !== id));

            setCurrentIndex(0);

            toast.success("Student Deleted Successfully");
        } catch (error) {
            console.error(error);
            toast.error("Student Delete Failed");
        }
    };



    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < filteredStudents.length - 1) {
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
                "http://localhost:4004/api/students",
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


    const filteredStudents = details.filter((item) =>
        item.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        item.mentor?.toLowerCase().includes(search.toLowerCase())
    );



    const getMentorName = (mentorId) => {
        const staff = staffList.find((s) => s._id === mentorId);
        return staff ? staff.userName : mentorId; // fallback = id
    };


    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const res = await axios.get(
                    "http://localhost:4004/api/staff",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setStaffList(res.data);

            } catch (err) {
                console.error("Staff fetch error", err);
            }
        };

        fetchStaff();
    }, []);


    return (
        <div id="studentlist-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/add-student")}>
                    <TbUsersGroup /> &nbsp; Add Student
                </div>

                <div id="center-letter">Manage Student Data</div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Student Info</span>&nbsp;›&nbsp;
                    <span className="active">Student List</span>
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
                                <th>mentor</th>
                                <th>doj</th>
                                <th>studentStatus</th>
                                <th>Due</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="tbody">
                            {filteredStudents.length === 0 || !filteredStudents[currentIndex] ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        NO STUDENT DETAILS YET...
                                    </td>
                                </tr>
                            ) : (
                                <tr key={filteredStudents[currentIndex]._id}>
                                    <td>{currentIndex + 1}</td>
                                    <td>{filteredStudents[currentIndex].studentId}</td>
                                    <td>{filteredStudents[currentIndex].firstName}</td>
                                    <td>{filteredStudents[currentIndex].email}</td>
                                    <td>
                                        {filteredStudents[currentIndex].dob
                                            ? new Date(filteredStudents[currentIndex].dob).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{filteredStudents[currentIndex].contactNumber}</td>
                                    {/* <td>{filteredStudents[currentIndex].mentor}</td> */}
                                    <td>{getMentorName(filteredStudents[currentIndex].mentor)}</td>
                                    <td>
                                        {filteredStudents[currentIndex].dateOfJoining
                                            ? new Date(filteredStudents[currentIndex].dateOfJoining).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{filteredStudents[currentIndex].studentStatus}</td>
                                    <td>{filteredStudents[currentIndex].remainingAmount}</td>
                                    <td className="action-col">
                                        <button
                                            className="edit"
                                            onClick={() =>
                                                navigate(`/dashboard/add-student/${filteredStudents[currentIndex]._id}`)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete"
                                            onClick={() => handleDelete(filteredStudents[currentIndex]._id)}
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
                        <button id="nxt" onClick={handleNext} disabled={currentIndex === filteredStudents.length - 1} >
                            Next
                        </button>
                    </div>



                </div>
            </div>


        </div >
    );
};

export default Addstudentlist;