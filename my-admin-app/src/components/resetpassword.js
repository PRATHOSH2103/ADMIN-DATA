// import React, { useState } from 'react';
// // import { authAxios } from "../auth";
// import { useNavigate, useParams } from "react-router-dom"
// import axios from 'axios';

// import { toast } from "react-toastify";

// const ResetPassword = () => {

//     const [newPassword, setNewpassword] = useState("");
//     const [confirmpassword, setConfirmpassword] = useState("");
//     const [message, setMessage] = useState("")
//     const { token } = useParams()


//     const [showNew, setShowNew] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);

//     const navigate = useNavigate()


//     const HandleSubmit = async (e) => {
//         e.preventDefault();

//         // console.log("TOKEN", token);

//         // 16

//         if (newPassword.length < 6) {
//             return setMessage("Password must be at least 6 characters");
//         }

//         if (newPassword !== confirmpassword) {
//             return setMessage("Passwords do not match");
//         }

//         try {

//             const res = await axios.post(
//                 `http://localhost:4004/api/reset-password/${token}`,
//                 {
//                        password: newPassword
//                 }
//             );

//             toast.success(res.data.msg || "Password updated Successfully");

//             setTimeout(() => {
//                 navigate("/login");
//             }, 2000);

//         } catch (error) {
//              toast.error(
//                 error.response?.data?.msg || "Reset link expired or invalid"
//             );
//         }

//     };

//     return (
//         <>
//             <div id="log-in">
//                 <div id="out">
//                     <div id="log">

//                         <h3 id="resetpass">RESET PASSWORD</h3>

//                         <br />
//                         <form onSubmit={HandleSubmit}>
//                             <div className="password-field">
//                                 <input
//                                     className="input"
//                                     type={showNew ? "text" : "password"}
//                                     placeholder="New Password"
//                                     required
//                                     value={newPassword}
//                                     onChange={(e) =>
//                                         setNewpassword(e.target.value)
//                                     }
//                                 />
//                                 <span
//                                     className="toggle"
//                                     onClick={() => setShowNew(!showNew)}
//                                 >
//                                     {showNew ? "🙈" : "👁️"}
//                                 </span>
//                             </div>
//                             <br />
//                             <br />
//                             <div className="password-field">
//                                 <input
//                                     className="input"
//                                     type={showConfirm ? "text" : "password"}
//                                     placeholder="Confirm Password"
//                                     required
//                                     value={confirmpassword}
//                                     onChange={(e) =>
//                                         setConfirmpassword(e.target.value)
//                                     }
//                                 />
//                                 <span
//                                     className="toggle"
//                                     onClick={() =>
//                                         setShowConfirm(!showConfirm)
//                                     }
//                                 >
//                                     {showConfirm ? "🙈" : "👁️"}
//                                 </span>
//                             </div>
//                             <br />
//                             <br />
//                             <div id="btn">
//                                 <button id="btnsubmit">UPDATE</button>
//                             </div>
//                         </form>

//                     </div>

//                 </div>


//             </div>

//         </>
//     )
// }

// export default ResetPassword;









import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:4004/api/reset-password/${token}`,
        { password: newPassword }
      );

      toast.success(res.data.msg || "Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Reset link expired or invalid"
      );
    }
  };

  return (
    <div id="log-in">
      <div id="out">
        <div id="log">

          <h3 id="resetpass">RESET PASSWORD</h3>
           &nbsp;
          <form onSubmit={handleSubmit}>

            <div className="password-field">
              <input
                className="input"
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <span
                className="toggle"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? "🙈" : "👁️"}
              </span>
            </div>

            <br />
            &nbsp;

            <div className="password-field">
              <input
                className="input"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span
                className="toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
             <br/>
             <br/>

            <div id="btn">
              <button id="btnsubmit">UPDATE</button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;






