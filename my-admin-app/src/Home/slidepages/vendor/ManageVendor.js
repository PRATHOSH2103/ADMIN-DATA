// import axios from "axios";
// import { useEffect, useState } from "react";
// import { TbUsersGroup } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";

// import Swal from "sweetalert2";
// import { toast } from "react-toastify";

// const ManageVendor = () => {
//     const [vendors, setVendors] = useState([]);
//     const [search, setSearch] = useState("");
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const navigate = useNavigate();


//     const getVendors = async () => {
//         try {
//             const token = localStorage.getItem("adminToken");
//             const res = await axios.get("http://localhost:4004/api/vendor", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setVendors(res.data);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         getVendors();
//     }, []);


//     const handleDelete = async (id) => {
//         // if (!window.confirm("Are you sure you want to delete this vendor?")) return;

//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You want to delete this vendor !",
//             icon: "warning",
//             width: 100,
//             heightAuto: false,
//             showCancelButton: true,
//             confirmButtonText: "Yes, delete it!",
//             confirmButtonColor: "#e74c3c",
//             cancelButtonColor: "#6c757d",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             const token = localStorage.getItem("adminToken");

//             await axios.delete(`http://localhost:4004/api/vendor/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setVendors((prev) => prev.filter((v) => v._id !== id));
//             setCurrentIndex(0);

//             toast.success("Vendor deleted Successfully");
//         } catch (error) {
//             console.error(error);
//             toast.error("Delete failed");
//         }
//     };


//     const filteredVendors = vendors.filter(
//         (v) =>
//             v.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
//             v.mobileNumber?.includes(search) ||
//             v.email?.toLowerCase().includes(search.toLowerCase())
//     );


//     const handleNext = () => {
//         if (currentIndex < filteredVendors.length - 1) {
//             setCurrentIndex(currentIndex + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex(currentIndex - 1);
//         }
//     };

//     const vendor = filteredVendors[currentIndex];

//     return (
//         <div id="studentlist-form">
//             <div className="header">
//                 <div id="student" onClick={() => navigate("/dashboard/add-vendor")}>
//                     <TbUsersGroup /> &nbsp; Create Vendor &nbsp;
//                 </div>

//                 <div id="center-letter">Manage Vendors</div>

//                 <div className="page" onClick={() => navigate("/dashboard")}>
//                     <span>Vendor</span> &nbsp; ›  &nbsp; <span className="active">Manage Vendors</span>
//                 </div>
//             </div>
//             &nbsp;
//             <div id="student-data">
//                 <br />
//                 <input id="text" type="search" placeholder="search" value={search}
//                     onChange={(e) => setSearch(e.target.value)} />
//                 <br />
//                 <br />
//                 <div id="studentdetails">
//                     <table id="data">
//                         <thead>
//                             <tr id="rows">
//                                 <th>S.No</th>
//                                 <th>Name</th>
//                                 <th>Type</th>
//                                 <th>Mobile</th>
//                                 <th>Email</th>
//                                 <th>Balance</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>

//                         <tbody id="tbody">
//                             {filteredVendors.length === 0 || !filteredVendors[currentIndex] ? (
//                                 <tr>
//                                     <td colSpan="11" style={{ textAlign: "center" }}>
//                                         NO CUSTOMER DETAILS YET...
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 <tr key={filteredVendors[currentIndex]._id}>
//                                     <td>{currentIndex + 1}</td>
//                                     <td>{filteredVendors[currentIndex].vendorName}</td>
//                                     <td>{filteredVendors[currentIndex].vendorType}</td>
//                                     <td>{filteredVendors[currentIndex].mobileNumber}</td>
//                                     <td>{filteredVendors[currentIndex].email}</td>
//                                     <td>{filteredVendors[currentIndex].remainingAmount}</td>
//                                     <td className="action-col">
//                                         <button
//                                             className="edit"
//                                             onClick={() =>
//                                                 navigate(`/dashboard/add-vendor/${filteredVendors[currentIndex]._id}`)

//                                             }
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             className="delete"
//                                             onClick={() => handleDelete(filteredVendors[currentIndex]._id)}
//                                         >
//                                             Del
//                                         </button>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>


//                     </table>
//                     <br />
//                     <div id="pre-nxt">
//                         <button onClick={handlePrevious} disabled={currentIndex === 0}>
//                             Previous
//                         </button>
//                         <button id="nxt" onClick={handleNext} disabled={currentIndex === filteredVendors.length - 1} >
//                             Next
//                         </button>
//                     </div>



//                 </div>
//             </div>

//         </div>
//     );
// };

// export default ManageVendor;




























import axios from "axios";
import { useEffect, useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManageVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();

    /* FETCH VENDORS */
    const getVendors = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                "http://localhost:4004/api/vendor",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setVendors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getVendors();
    }, []);

    /* DELETE VENDOR */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this vendor!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("adminToken");

            await axios.delete(
                `http://localhost:4004/api/vendor/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setVendors((prev) => prev.filter((v) => v._id !== id));
            setCurrentIndex(0);

            toast.success("Vendor deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

    /* SEARCH FILTER */
    const filteredVendors = vendors.filter(
        (v) =>
            v.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
            v.mobileNumber?.includes(search) ||
            v.email?.toLowerCase().includes(search.toLowerCase())
    );

    const vendor = filteredVendors[currentIndex];

    /* NAVIGATION */
    const handleNext = () => {
        if (currentIndex < filteredVendors.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <div id="studentlist-form">

            {/* HEADER */}
            <div className="header">

                <div
                    id="student"
                    onClick={() => navigate("/dashboard/add-vendor")}
                >
                    <TbUsersGroup /> &nbsp; Create Vendor
                </div>

                <div id="center-letter">
                    Manage Vendors
                </div>

                <div
                    className="page"
                    onClick={() => navigate("/dashboard")}
                >
                    <span>Vendor</span>&nbsp; › &nbsp;<span className="active">Manage Vendors</span>
                </div>

            </div>
            &nbsp;
            <div id="student-data">
                &nbsp;
                <input
                    id="text"
                    type="search"
                    placeholder="Search vendor..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentIndex(0);
                    }}
                />
                &nbsp;
                <div id="studentdetails">

                    <table id="data">

                        <thead>
                            <tr id="rows">
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Balance</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {!vendor ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        NO VENDOR DETAILS YET...
                                    </td>
                                </tr>
                            ) : (

                                <tr key={vendor._id}>

                                    <td>{currentIndex + 1}</td>
                                    <td>{vendor.vendorName}</td>
                                    <td>{vendor.vendorType}</td>
                                    <td>{vendor.mobileNumber}</td>
                                    <td>{vendor.email}</td>
                                    <td>{vendor.remainingAmount}</td>

                                    <td>

                                        <button
                                            className="edit"
                                            onClick={() =>
                                                navigate(`/dashboard/add-vendor/${vendor._id}`)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete"
                                            onClick={() => handleDelete(vendor._id)}
                                        >
                                            Del
                                        </button>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>
                    &nbsp;
                    {/* PAGINATION */}
                    <div id="pre-nxt">

                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>

                        <button
                            id="nxt"
                            onClick={handleNext}
                            disabled={currentIndex === filteredVendors.length - 1}
                        >
                            Next
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManageVendor;