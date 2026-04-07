
import { useState } from "react";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../../../auth";

import { toast } from "react-toastify"

const InvoiceId = () => {
  const navigate = useNavigate();
  const [invoiceId, setInvoiceId] = useState("");

  const handleSetInvoiceID = async (e) => {
    e.preventDefault();

    try {
      const res = await authAxios.get("/customer/next-id");

      const generatedId = res.data.invoiceId;
      setInvoiceId(generatedId);

      // 👉 redirect to Add Customer with invoiceId
      navigate("/dashboard/add-customer", {
        state: { invoiceId: generatedId }
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Invoice ID");
    }
  };

  return (
    <div id="master-form">
      <div className="header">
        <div id="student">
          <TbUsersGroup /> &nbsp; Add Customer
        </div>

        <div id="center-letter">Set Invoice ID</div>
        <div className="page" onClick={() => navigate("/dashboard")}>
          <span>Master</span>
          &nbsp;
          <span className="separator">›</span>
          &nbsp;
          <span className="active">Invoice No</span>
        </div>
      </div>
      <br />
      <form id="padding" onSubmit={handleSetInvoiceID}>
        <div className="form-group">
          <label>
            Invoice ID <span id="star">*</span>
          </label>
          <input
            value={invoiceId}
            readOnly
            placeholder="KIT/23/001"
          />
        </div>
        <br />
        <br />
        <div id="registerBtn">
          <button type="submit">Set ID</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceId;
