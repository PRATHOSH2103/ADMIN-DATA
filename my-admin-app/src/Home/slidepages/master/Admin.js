
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { TbUsersGroup } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";

// import Swal from "sweetalert2";
// import { toast } from "react-toastify";

// const Admin = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("adminToken");

//     const [records, setRecords] = useState([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(false);

//     const [currentIndex, setCurrentIndex] = useState(0);

//     /*  FETCH BOTH  */
//     const fetchData = useCallback(async () => {
//         try {

//             setLoading(true);

//             const res = await axios.get("http://localhost:4004/api/staff", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             setRecords(res.data);

//         } catch (err) {

//             toast.error("Failed to load admins");

//         } finally {

//             setLoading(false);

//         }

//     }, [token]);
//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     /*  FILTER  */
//     const filteredData = records.filter((item) => {

//         const name = `${item.staffName?.firstName || ""} ${item.staffName?.lastName || ""}`;

//         return name.toLowerCase().includes(search.toLowerCase());

//     });

//     /*  DELETE  */
//     const handleDelete = async (id) => {

//         // if (!window.confirm("Are You Sure to Want Delete this admin?")) return;

//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You want to delete this admin !",
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

//             await axios.delete(`http://localhost:4004/api/staff/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             fetchData();

//         } catch {
//             toast.error("Delete failed");
//         }
//     };


//     const currentItem = filteredData[currentIndex];

//     return (
//         <div id="studentlist-form">
//             <div className="header">
//                 <div id="studentone" onClick={() => navigate("/dashboard/create-staff")}>
//                     <TbUsersGroup /> &nbsp; Add Admin
//                 </div>

//                 <div id="center-letter">
//                     Admins
//                 </div>

//                 <div className="page" onClick={() => navigate("/dashboard")}>
//                     <span>Master</span>&nbsp;›&nbsp;
//                     <span className="active">Admins</span>
//                 </div>
//             </div>
//             <br />
//             <div id="student-data">
//                 <br />

//                 <input
//                     id="text"
//                     type="search"
//                     placeholder="Search by name..."
//                     value={search}
//                     // onChange={(e) => setSearch(e.target.value)}
//                     onChange={(e) => {
//                         setSearch(e.target.value);
//                         setCurrentIndex(0);
//                     }}
//                 />

//                 <br /><br />

//                 <div id="studentdetails">
//                     <table id="data">
//                         <thead>
//                             <tr id="rows">
//                                 <th>S.No</th>
//                                 <th>Admin Name</th>
//                                 <th>DOJ</th>
//                                 <th>user Name</th>
//                                 <th>Password</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>

//                         {/* <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="8" style={{ textAlign: "center" }}>
//                                         Loading...
//                                     </td>
//                                 </tr>
//                             ) : filteredData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="8" style={{ textAlign: "center" }}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredData.map((item, index) => (
//                                     <tr key={item._id}>
//                                         <td>{index + 1}</td>
//                                         <td style={{ textTransform: "capitalize" }}>
//                                             {item.type}
//                                         </td>
//                                         <td>{item.name || "-"}</td>
//                                         <td>{item.paymentType}</td>
//                                         <td>{item.paidAmount}</td>
//                                         <td>{item.remainingAmount}</td>
//                                         <td>
//                                             {item.createdAt
//                                                 ? new Date(item.createdAt).toLocaleDateString()
//                                                 : "-"}
//                                         </td>
//                                         <td>
//                                             <button
//                                                 className="edit"
//                                                 onClick={() =>
//                                                     handleEdit(item._id, item.type)
//                                                 }
//                                             >
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 className="delete"
//                                                 onClick={() =>
//                                                     handleDelete(item._id, item.type)
//                                                 }
//                                             >
//                                                 Del
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody> */}
//                         <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="6" style={{ textAlign: "center" }}>
//                                         Loading...
//                                     </td>
//                                 </tr>
//                             ) : filteredData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" style={{ textAlign: "center" }}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredData.map((item, index) => (
//                                     <tr key={item._id}>
//                                         <td>{index + 1}</td>

//                                         <td>{item.staffName?.firstName} {item.staffName?.lastName}</td>

//                                         <td>
//                                             {item.dateOfJoining
//                                                 ? new Date(item.dateOfJoining).toLocaleDateString()
//                                                 : "-"}
//                                         </td>

//                                         <td>{item.userName}</td>

//                                         <td>{item.password || "*****"}</td>

//                                         <td>
//                                             <button
//                                                 className="edit"
//                                                 onClick={() => navigate(`/dashboard/create-staff/${item._id}`)}
//                                             >
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 className="delete"
//                                                 onClick={() => handleDelete(item._id)}
//                                             >
//                                                 Del
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                     &nbsp;

//                     {filteredData.length > 0 && (
//                         <div id="pre-nxt" >
//                             <button
//                                 onClick={() => setCurrentIndex((prev) => prev - 1)}
//                                 disabled={currentIndex === 0}
//                             >
//                                 Previous
//                             </button>
//                             <button
//                                 id="nxt"
//                                 onClick={() => setCurrentIndex((prev) => prev + 1)}
//                                 disabled={currentIndex === filteredData.length - 1}
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Admin;































import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const API = "http://localhost:4004/api";

const Admin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* FORMAT DATE */
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  /* FETCH ADMINS */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data);
    } catch (err) {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* FILTER SEARCH */
  const filteredData = records.filter((item) => {
    const name = `${item.staffName?.firstName || ""} ${
      item.staffName?.lastName || ""
    }`;

    return name.toLowerCase().includes(search.toLowerCase());
  });

  /* DELETE ADMIN */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Admin?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e74c3c",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Admin deleted successfully");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div id="studentlist-form">
      {/* HEADER */}
      <div className="header">
        <div
          id="studentone"
          onClick={() => navigate("/dashboard/create-staff")}
        >
          <TbUsersGroup /> &nbsp; Add Admin
        </div>

        <div id="center-letter">Admins</div>

        <div className="page" onClick={() => navigate("/dashboard")}>
          <span>Master</span>&nbsp; › &nbsp;<span className="active">Admins</span>
        </div>
      </div>

      <br />

      {/* SEARCH */}
      <div id="student-data">
        <input
          id="text"
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <br />
        <br />

        {/* TABLE */}
        <div id="studentdetails">
          <table id="data">
            <thead>
              <tr id="rows">
                <th>S.No</th>
                <th>Admin Name</th>
                <th>DOJ</th>
                <th>User Name</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td style={{ textTransform: "capitalize" }}>
                      {`${item.staffName?.firstName || ""} ${
                        item.staffName?.lastName || ""
                      }`}
                    </td>

                    <td>{formatDate(item.dateOfJoining)}</td>

                    <td>{item.userName}</td>

                    {/* Never show real password */}
                    <td>******</td>

                    <td>
                      <button
                        className="edit"
                        onClick={() =>
                          navigate(`/dashboard/create-staff/${item._id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        Del
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;