import { TfiAlignJustify } from "react-icons/tfi";
import { FaSearch } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoScan } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";

import { toast } from "react-toastify"

import axios from "axios";

const TopBar = ({ setSidebarOpen }) => {

    const navigate = useNavigate()

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [showNew, setShowNew] = useState(false);


    const [openMenu, setOpenMenu] = useState(null);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);



    const firstLetter = user?.name?.[0]?.toUpperCase() || "?";




    const [hoverTimer, setHoverTimer] = useState(null);
    const handleMouseEnter = () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        setOpenMenu("profile");
    };

    const handleMouseLeave = () => {
        const timer = setTimeout(() => {
            setOpenMenu(null);
        }, 2000);

        setHoverTimer(timer);
    };



    return (
        <>
            <div id="right-in">
                <div id="toggle" onClick={() => setSidebarOpen(prev => !prev)}>
                    <TfiAlignJustify />
                </div>

                &nbsp;
                &nbsp;
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1"> <FaSearch /> &nbsp; &nbsp;  <input
                        type="text"
                        id="searchbar"
                        className="form-control"
                        placeholder="Search..."
                        onChange={(e) => {
                            const value = e.target.value.toLowerCase();
                            localStorage.setItem("dashboardSearch", value);
                            window.dispatchEvent(new Event("dashboardSearchUpdated"));
                        }}
                    /></span>

                </div>

                {/* email */}

                <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="mail"
                ><MdOutlineEmail /></a>
                {/* &nbsp; */}
                <div id="toggle" onClick={() => setSidebarOpen(prev => !prev)}><IoScan /></div>

                {/* profile */}
                <div
                    id="profile"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="profile">
                        <span className="avatartwo">{firstLetter}</span>
                    </div>

                    {openMenu === "profile" && (
                        <div id="update">
                            <div id="up"
                                onClick={() => {
                                    setEditName(user?.name || "");
                                    setEditPassword(user?.password || "");
                                    setShowProfileModal(true);
                                    setOpenMenu(null);
                                }}
                            >
                                Profile
                            </div>

                            <div className="log"
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    toast.success("Logged out");
                                    setTimeout(() => navigate("/login"), 1000);
                                }}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>

                {showProfileModal && (
                    <div className="modal">
                        <div className="field-modal-box-one">

                            <div className="up-profile">
                                <h5>UPDATE PROFILE</h5>
                                <button id="cancel" onClick={() => setShowProfileModal(false)}><GrClose /></button>
                            </div>

                            <label>Username <span id="star">*</span></label>
                            <input
                                className="field-input"
                                type="text"
                                placeholder="Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            &nbsp;

                            <div className="password-field">
                                <label>Password <span id="star">*</span></label>
                                <input
                                    className="field-input"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                />

                                <span
                                    className="toggle-topbar"
                                    onClick={() => setShowNew(!showNew)}
                                >
                                    {showNew ? "🙈" : "👁️"}
                                </span>
                            </div>
                            &nbsp;
                            <div className="modal-actions">
                                <button id="btnsubmit"
                                    // onClick={() => {
                                    //     const updatedUser = {
                                    //         ...user,
                                    //         name: editName,
                                    //         password: editPassword
                                    //     };

                                    //     setUser(updatedUser);
                                    //     localStorage.setItem("user", JSON.stringify(updatedUser));

                                    //     setShowProfileModal(false);
                                    // }}

                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem("adminToken");

                                            const res = await axios.put(
                                                "http://localhost:4004/api/update-profile",
                                                {
                                                    name: editName,
                                                    password: editPassword
                                                },
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                }
                                            );

                                            const updatedUser = res.data.user;

                                            // update UI
                                            setUser(updatedUser);

                                            //  update localStorage
                                            localStorage.setItem("user", JSON.stringify(updatedUser));

                                            //  notify dashboard
                                            window.dispatchEvent(new Event("userUpdated"));

                                            toast.success("Profile updated Successfully");

                                            setShowProfileModal(false);

                                        } catch (err) {
                                            toast.error("Update failed ");
                                        }
                                    }}
                                >
                                    Save
                                </button>
                            </div>

                        </div>

                    </div>
                )}

            </div >
        </>
    );
};

export default TopBar;
