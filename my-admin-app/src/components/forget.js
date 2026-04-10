
import axios from 'axios';
import React, { useState } from 'react';

import { toast } from "react-toastify";

const Forgot = () => {

    const [email, setEmail] = useState("");


    const HandleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:4004/api/forgot-password",
                { email : email },
                { headers: { "Content-Type": "application/json" } }
            );

            toast.success(res.data.msg);
            setEmail("");


        } catch (err) {
            console.log(err);

            if (err.response && err.response.data && err.response.data.msg) {
                 toast.error(err.response.data.msg);
            } else {
                toast.error("Failed to send reset email");
            }
        }
    };

    return (
        <div id="log-in">
            <div id="out">
                <div id="log">

                    <h3 id="forgetpass">FORGOT PASSWORD</h3>
                    <br />
                    <form onSubmit={HandleSubmit}>

                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <br />
                        <br />
                        <div id="btn">
                            <button id="btnsubmit">SEND</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Forgot;

