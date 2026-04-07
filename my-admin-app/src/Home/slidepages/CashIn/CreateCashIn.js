import React, { useEffect, useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import StudentCashForm from "./StudentCashForm";
import CustomerCashForm from "./CustomerCashForm";
import { useNavigate, useParams } from "react-router-dom";

const CreateCashIn = () => {
    const navigate = useNavigate();
    const { type, id } = useParams();

    const [cashType, setCashType] = useState(type || "customer");

    useEffect(() => {
        if (type) setCashType(type);
    }, [type]);

    return (
        <div className="cash-container">
            <div className="cash-card">

                <div className="cash-header">
                    <button id="studentfour" onClick={() => navigate("/dashboard/cash-out")}>
                        <TbUsersGroup />
                        &nbsp; Cash In
                    </button>

                    <h2 id="center-letter">
                        {id
                            ? `Edit ${cashType === "student" ? "Student" : "Customer"} Cash In`
                            : `Create ${cashType === "student" ? "Student" : "Customer"} Cash In`}
                    </h2>
                    
                    <div className="cash-type">
                        <label>
                            <input
                                type="radio"
                                value="student"
                                checked={cashType === "student"}
                                onChange={(e) => setCashType(e.target.value)}
                                disabled={!!id}
                            />
                            &nbsp;
                            Student
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="customer"
                                checked={cashType === "customer"}
                                onChange={(e) => setCashType(e.target.value)}
                                disabled={!!id}
                            />
                            &nbsp;
                            Customer
                        </label>
                    </div>
                </div>
                <br/>
                <br/>
                {cashType === "student" ? (
                    <StudentCashForm id={id} />
                ) : (
                    <CustomerCashForm id={id} />
                )}

            </div>
        </div>
    );
};

export default CreateCashIn;
