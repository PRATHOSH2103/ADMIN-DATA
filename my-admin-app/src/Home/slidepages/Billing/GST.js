import React, { useEffect, useState } from "react";
import logo from "../../kitkat logo1.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

const Invoice = () => {


    const navigate = useNavigate();

    const location = useLocation();
    const token = localStorage.getItem("adminToken");

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [InvoiceNo, setInvoiceNo] = useState("");
    const [GSTIN, setGSTIN] = useState("");
    const [date, setDate] = useState("");


    useEffect(() => {
        axios.get("http://localhost:4004/api/customer", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setCustomers(res.data));
    }, [token]);

    useEffect(() => {
        if (location.state) {
            setSelectedCustomer(location.state.customerId);
            setInvoiceNo(location.state.InvoiceNo);
            setGSTIN(location.state.GSTIN);
            setDate(location.state.date);
        }
    }, [location.state]);



    const [rows, setRows] = useState([
        { description: "", qty: "", price: "", total: 0 }
    ]);


    const addRow = () => {
        // if (!rows[rows.length - 1].description) return;
        setRows([...rows, { description: "", qty: "", price: "", total: 0 }]);
    };


    const deleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };


    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;

        const qty = Number(updatedRows[index].qty || 0);
        const price = Number(updatedRows[index].price || 0);
        updatedRows[index].total = qty * price;

        setRows(updatedRows);
    };


    const subTotal = rows.reduce((sum, r) => sum + r.total, 0);
    const igst = subTotal * 0.18;
    const grandTotal = subTotal + igst;


    //     try {
    //         if (!selectedCustomer) {
    //             alert("Please select a customer");
    //             return;
    //         }

    //         const filteredItems = rows
    //             .filter(r => r.description && Number(r.qty) > 0 && Number(r.price) > 0)
    //             .map(r => ({
    //                 description: r.description,
    //                 qty: Number(r.qty),
    //                 price: Number(r.price),
    //                 total: Number(r.total)
    //             }));

    //         if (filteredItems.length === 0) {
    //             alert("Please add at least one valid item");
    //             return;
    //         }

    //         const subTotal = filteredItems.reduce((sum, r) => sum + r.total, 0);
    //         const igst = subTotal * 0.18;
    //         const grandTotal = subTotal + igst;

    //         const invoiceData = {
    //             customerId: selectedCustomer,
    //             InvoiceNo,
    //             GSTIN,
    //             date: date || new Date().toISOString(),
    //             items: filteredItems,
    //             subTotal,
    //             igst,
    //             grandTotal
    //         };

    //         await axios.post("http://localhost:4004/api/invoice", invoiceData, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         alert("Invoice saved Successfully!");

    //         setSelectedCustomer("");
    //         setInvoiceNo("");
    //         setGSTIN("");
    //         setDate("");
    //         setRows([{ description: "", qty: "", price: "", total: 0 }]);

    //         navigate("/dashboard")

    //     } catch (error) {
    //         console.error("SAVE ERROR 👉", error.response?.data || error);
    //         alert(error.response?.data?.message || "Failed to save invoice");
    //     }
    // };

    const handleSave = async () => {
        try {
            const filteredItems = rows
                .filter(r => r.description && r.qty > 0 && r.price > 0)
                .map(r => ({
                    description: r.description,
                    qty: Number(r.qty),
                    price: Number(r.price),
                    total: Number(r.total)
                }));

            const invoiceData = {
                customerId: selectedCustomer,
                InvoiceNo,
                GSTIN,
                date,
                items: filteredItems,
                subTotal,
                igst,
                grandTotal
            };

            const response = await axios.post(
                "http://localhost:4004/api/invoice",
                invoiceData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob"   
                }
            );

            const blob = new Blob([response.data], {
                type: "application/pdf"
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice_${InvoiceNo}.pdf`;
            link.click();

            toast.success("Invoice Saved & PDF Download Successfully")

            setSelectedCustomer("");
            setInvoiceNo("");
            setGSTIN("");
            setDate("");
            setRows([{ description: "", qty: "", price: "", total: 0 }]);

            navigate("/dashboard")

        } catch (err) {
            console.error(err);
            toast.error("PDF generation failed");
        }
    };




    const numberToWords = (num) => {
        if (num === 0) return "Zero";

        const a = [
            "", "One", "Two", "Three", "Four", "Five", "Six",
            "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
            "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
        ];

        const b = [
            "", "", "Twenty", "Thirty", "Forty",
            "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];


        const convert = (n) => {
            if (n < 20) return a[n];
            if (n < 100)
                return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
            if (n < 1000)
                return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
            if (n < 100000)
                return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
            if (n < 10000000)
                return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
            return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
        };

        return convert(Math.floor(num));
    };



    const handlePrint = () => {
        window.print();
    };




    return (
        <div className="invoice-page">
            <div className="invoice-container" >

                <div className="header">
                    <div className="company">
                        <div id="IN">INVOICE</div>
                        <div id="kit">KITKAT SOFTWARE TECHNOLOGIES</div>
                        <div id="address">
                            <div>No: 707, 1st Floor, Krishna complex, PN Palayam</div>
                            <div>Coimbatore - 641037</div>
                            <div>Phone No : 7010816299 , 04224957272.</div>
                        </div>
                    </div>

                    <div className="right-box">
                        <img className="logo" src={logo} alt="logo" />
                        &nbsp;
                        <div className="info-box">
                            <div><span className="label">DATE :</span><span className="value">{date ? new Date(date).toLocaleDateString() : ""}</span></div>
                            <div><span className="label">INVOICE NO :</span> <span className="value">{InvoiceNo}</span></div>
                            <div><span className="label">GSTIN :</span> <span className="value">{GSTIN}</span></div>
                        </div>
                    </div>
                </div>

                <div className="client-box">
                    <label>INVOICE TO:</label>
                    {/* <div><span className="label">INVOICE NO :</span> <span className="value">{InvoiceNo}</span></div> */}
                    <br />
                    <br />
                    <select
                        id="selectclient"
                        value={selectedCustomer}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedCustomer(id);

                            const cust = customers.find(c => c._id === id);
                            if (cust) {
                                setDate(cust.date)
                                setInvoiceNo(cust.InvoiceNo);
                                setGSTIN(cust.GSTIN);
                            }
                        }}
                    >
                        <option value="">Select a Client</option>
                        {customers.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.clientName}
                            </option>
                        ))}
                    </select>

                    <br />
                    <br />
                    <p>GSTIN / UIN :</p>
                    {/* <div><span className="label">GSTIN :</span> <span className="value">{GSTIN}</span></div> */}
                </div>


                <div className="invoice-wrapper">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>DESCRIPTION</th>
                                <th>QTY</th>
                                <th>UNIT PRICE (INR)</th>
                                <th>PRICE (INR)</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            value={row.description}
                                            onChange={(e) => handleChange(index, "description", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.qty}
                                            onChange={(e) => handleChange(index, "qty", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.price}
                                            onChange={(e) => handleChange(index, "price", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <div id="price">{row.total.toFixed(2)}</div>
                                    </td>
                                    <td>
                                        <span id="plus" onClick={addRow}>➕</span>
                                        &nbsp;
                                        &nbsp;
                                        {rows.length > 1 && (
                                            <span id="delete" onClick={() => deleteRow(index)}>🗑</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            <tr className="summary-row">
                                <td colSpan="3"></td>
                                <td className="labels">
                                    <div>Sub Total</div>
                                    <div>IGST</div>
                                    <div>TOTAL</div>
                                </td>
                                <td className="values">
                                    <div className="red">{subTotal.toFixed(2)}</div>
                                    <div>{igst.toFixed(2)} INR</div>
                                    <div className="red">{grandTotal.toFixed(2)}</div>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div className="footer-wrapper">
                    {/* <div className="top-row">
                        <div className="total-words">
                            <strong>Total (In Words) :</strong> ZERO
                        </div>

                        <div className="action-buttons">
                            <button className="save-btn">Save</button>
                            <button className="print-btn">Print</button>
                        </div>
                    </div> */}
                    <div className="top-row">
                        <div className="total-words">
                            <strong>Total (In Words) :</strong> {" "}
                            {numberToWords(grandTotal)} Rupees Only

                        </div>

                        <div className="action-buttons">
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="print-btn" onClick={handlePrint}>Print</button>
                        </div>
                    </div>

                    <div className="bank-details">
                        <h4>Bank Account Details</h4>

                        <div className="bank-row"><span>Name</span><span>: &nbsp; Kitkat Software Technologies</span></div>
                        <div className="bank-row"><span>Bank</span><span>: &nbsp; Federal Bank</span></div>
                        <div className="bank-row"><span>Account No</span><span>: &nbsp; 1982920003697</span></div>
                        <div className="bank-row"><span>IFSC Code</span><span>: &nbsp; FDRL0001982</span></div>
                        <div className="bank-row"><span>Branch</span><span>: &nbsp; Papanaickenpalayam</span></div>
                    </div>

                    <div className="thankyou">
                        THANK YOU FOR YOU BUSINESS!
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Invoice;
