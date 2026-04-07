
import axios from "axios";
import { useEffect, useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

const ViewCustomer = () => {
    const [details, setDetails] = useState([]);

    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    const handleDelete = async (id) => {
        // if (!window.confirm("Are you sure you want to delete this customer?")) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this customer !",
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

            await axios.delete(`http://localhost:4004/api/customer/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDetails(prev => prev.filter(item => item._id !== id));

            setCurrentIndex(0);

            toast.success("customer Deleted Successfully");
        } catch (error) {
            console.error(error);
            alert("Delete Failed");
        }
    };



    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < filteredCustomer.length - 1) {
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
                "http://localhost:4004/api/customer",
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


    const filteredCustomer = details.filter((item) =>
        item.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        item.InvoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.GSTIN?.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div id="studentlist-form">
            <div className="header">
                <div id="student" onClick={() => navigate("/dashboard/add-customer")}>
                    <TbUsersGroup /> &nbsp; Add Customer
                </div>

                <div id="center-letter">Manage Customer Data</div>

                <div className="page" onClick={() => navigate("/dashboard")}>
                    <span>Customer</span>&nbsp;›&nbsp;
                    <span className="active">Customer List</span>
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
                                <th>clientName</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>Date</th>
                                <th>State</th>
                                <th>Invoice No</th>
                                <th>GST IN</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="tbody">
                            {filteredCustomer.length === 0 || !filteredCustomer[currentIndex] ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        NO CUSTOMER DETAILS YET...
                                    </td>
                                </tr>
                            ) : (
                                <tr key={filteredCustomer[currentIndex]._id}>
                                    <td>{currentIndex + 1}</td>
                                    <td>{filteredCustomer[currentIndex].clientName}</td>
                                    <td>{filteredCustomer[currentIndex].address}</td>
                                    <td>{filteredCustomer[currentIndex].contactNumber}</td>
                                    <td>
                                        {filteredCustomer[currentIndex].date
                                            ? new Date(filteredCustomer[currentIndex].date).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{filteredCustomer[currentIndex].state}</td>
                                    <td>{filteredCustomer[currentIndex].InvoiceNo}</td>
                                    <td>{filteredCustomer[currentIndex].GSTIN}</td>
                                    <td className="action-col">
                                        <button
                                            className="edit"
                                            onClick={() =>
                                                navigate(`/dashboard/add-customer/${filteredCustomer[currentIndex]._id}`)

                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete"
                                            onClick={() => handleDelete(filteredCustomer[currentIndex]._id)}
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
                        <button id="nxt" onClick={handleNext} disabled={currentIndex === filteredCustomer.length - 1} >
                            Next
                        </button>
                    </div>



                </div>
            </div>


        </div >
    );
};

export default ViewCustomer;
