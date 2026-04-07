// import React, { useEffect, useState } from 'react';
// import { authAxios } from "../auth";
// import { useNavigate } from "react-router-dom"

// import { toast } from "react-toastify";

// const Login = () => {

//     const navigate = useNavigate()

//     const [ref, setref] = useState(false);

//     const [error, setError] = useState();

//     const [showNew, setShowNew] = useState(false);

//     const [userData, setUserData] = useState({
//         name: "",
//         password: ""
//     })

//     function GetData() {

//         authAxios
//             .get("/api/readData")
//             .then((result) => {

//                 console.log(result.data);

//             }).catch((err) => {
//                 console.log(err);

//             })

//     }
//     useEffect(() => {
//         GetData();
//     }, [ref]);

//     const HandleSubmit = async (e) => {
//         e.preventDefault();


//         try {
//             const res = await authAxios.post("http://localhost:4004/api/loginData", {
//                 name: userData.name,
//                 password: userData.password,
//             });

//             localStorage.setItem("user", JSON.stringify(res.data.saveData));
//             localStorage.setItem("adminToken", res.data.token);

//             toast.success("Hello Admin Login Successfully");
//             // toast.success(`Hello ${res?.data?.saveData?.name || "Admin"}  ${res?.data?.msg || ""}`);
//             setref(prev => !prev);

//             navigate("/dashboard")

//         } catch (err) {
//            toast.error("Incorrect username or password!");
//             setError(err.response?.data?.msg || "Login failed");
//         }
//     };


//     return (
//         <>
//             <div id="log-in">
//                 <div id="out">
//                     <div id="log">

//                         <h3 id="loged">SIGN IN</h3>
//                         <form onSubmit={HandleSubmit}>
//                             <br />
//                             <input className="log-input" type="text" placeholder="Name" name="name" required
//                                 onChange={(e) => setUserData({ ...userData, name: e.target.value })} value={userData.name}
//                             />

//                             <br />
//                             <br />
//                             <br />
//                             <div className="password-field">
//                                 <input
//                                     className="log-input"
//                                     type={showNew ? "text" : "password"}
//                                     placeholder="Password"
//                                     required
//                                     onChange={(e) => setUserData({ ...userData, password: e.target.value })} value={userData.password}
//                                 />
//                                 <span
//                                     className="toggle"
//                                     onClick={() => setShowNew(!showNew)}
//                                 >
//                                     {showNew ? "🙈" : "👁️"}
//                                 </span>
//                             </div>
//                             <br />
//                             {/* <br /> */}
//                             <div id="forget" onClick={() => (navigate("/forget"))}>Forget password ?</div>
//                             <br />
//                             {/* <br /> */}
//                             <div id="btn"><button id="btnsubmit">SIGN IN</button></div>
//                         </form>

//                     </div>

//                 </div>


//             </div>

//         </>
//     )
// }

// export default Login;











import React, { useEffect, useState } from "react";
import { authAxios } from "../auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();

    const [ref, setRef] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        password: ""
    });

    /* FETCH TEST DATA */
    const getData = () => {
        authAxios
            .get("/api/readData")
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getData();
    }, [ref]);

    /* LOGIN */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await authAxios.post(
                "http://localhost:4004/api/loginData",
                {
                    name: userData.name,
                    password: userData.password
                }
            );

            localStorage.setItem("user", JSON.stringify(res.data.saveData));
            localStorage.setItem("adminToken", res.data.token);

            toast.success("Hello Admin Login Successfully");

            setRef((prev) => !prev);

            navigate("/dashboard");

        } catch (err) {
            toast.error("Incorrect username or password!");
        }
    };

    return (
        <div id="log-in">

            <div id="out">

                <div id="log">

                    <h3 id="loged">SIGN IN</h3>
                    &nbsp;
                    <form onSubmit={handleSubmit}>

                        <input
                            className="log-input"
                            type="text"
                            placeholder="Name"
                            required
                            value={userData.name}
                            onChange={(e) =>
                                setUserData({ ...userData, name: e.target.value })
                            }
                        />

                        <br />
                        <br />
                        &nbsp;
                        <div className="password-field">

                            <input
                                className="log-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                value={userData.password}
                                onChange={(e) =>
                                    setUserData({ ...userData, password: e.target.value })
                                }
                            />

                            <span
                                className="toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>

                        </div>

                        <br />

                        <div id="forget" onClick={() => navigate("/forget")}>
                            Forget password ?
                        </div>

                        <br />

                        <div id="btn">
                            <button id="btnsubmit">SIGN IN</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Login;