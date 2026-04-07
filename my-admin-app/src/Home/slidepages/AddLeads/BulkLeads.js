
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BulkLeads = () => {


    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select file");
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                defval: "",
            });

            console.log("Excel Data:", jsonData);

            try {
                const res = await axios.post(
                    "http://localhost:4004/api/leads/bulk",
                    { leads: jsonData },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { inserted, skipped } = res.data;

                if (inserted > 0) {
                    toast.success(` Inserted: ${inserted}`);
                }

                if (skipped > 0 && inserted === 0) {
                    //  Only duplicates
                    toast.warning(`⚠️ All records already exist`);
                } else if (skipped > 0) {
                    //  Mixed case
                    toast.warning(`⚠️ ${skipped} records already exist`);
                }

                navigate("/dashboard/manage-leads");

            } catch (err) {
                console.error("UPLOAD ERROR:", err.response?.data || err);
                toast.error(err.response?.data?.message || "Upload failed");
            }
        };


        reader.readAsArrayBuffer(file);
    };


    return (
        <div id="master-form">
            <div className="header">
                <div id="center-letter">Bulk Upload Leads</div>
                <div className="back" onClick={() => navigate("/dashboard/manage-leads")}>BACK</div>
            </div>

            <br />

            <form onSubmit={(e) => {
                e.preventDefault();
                handleUpload();
            }}>
                <div className="form-group">
                    <label>
                        Upload File *
                    </label>

                    <input
                        type="file" accept=".xlsx,.xls" onChange={handleFileChange}
                    />
                </div>

                <br />

                <center>
                    <button type="submit" >
                        Upload
                    </button>
                </center>
            </form>
        </div>
    );
};

export default BulkLeads;
















