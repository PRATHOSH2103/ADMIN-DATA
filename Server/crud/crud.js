const multer = require("multer")
const User = require("../schema/schema");
const Student = require("../schema/studentschema")
const StudentCounter = require("../schema/counter")
const Employee = require("../schema/employeeSchema")
const EmployeeCounter = require("../schema/employeeCounter")

const Attendance = require("../schema/attendanceSchema");

const Customer = require("../schema/customerSchema");
const CustomerInvoiceCounter = require("../schema/InvoiceCounterSchema");

const Vendor = require("../schema/vendorschema")
const Staff = require("../schema/staffSchema");

const puppeteer = require("puppeteer");


const Invoice = require("../schema/InvoiceGSTSchema");

const Lead = require("../schema/leadSchema")


const CustomerCash = require("../schema/customerCashSchema ")
const StudentCash = require("../schema/studentCashSchema ")

const Interview = require("../schema/interviweSchema")

const Course = require("../schema/courseSchema")

const EmployeeType = require("../schema/employeeTypeSchema")


const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const XLSX = require("xlsx");


// READ
const getMethodfun = async (req, res) => {
  try {
    if (req.user.role === "admin") {

      let getData = await User.find();
      res.json(getData);
    }
    // let getData = await user.find();
    // res.json(getData);

  } catch (error) {
    res.json(error);
  }
};

// REGISTER
const postMethodfun = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      role: "admin"
    });

    res.status(201).json({
      msg: "Registered Successfully",
      saveData: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


// LOGIN

const loginMethod = async (req, res) => {
  try {

    const { name, password } = req.body;

    /* CHECK ADMIN USER */

    let user = await User.findOne({ name }).select("+password");

    if (user) {

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ msg: "Password incorrect" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.name
        },
        process.env.SECRETKEY,
        { expiresIn: "1d" }
      );

      return res.json({
        msg: "Login Successfullyl",
        saveData: {
          id: user._id,
          name: user.name,
          role: user.role
        },
        token
      });
    }

    /* CHECK STAFF USER */

    let staff = await Staff.findOne({ userName: name }).select("+password");

    if (!staff) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, staff.password);

    if (!match) {
      return res.status(400).json({ msg: "Password incorrect" });
    }

    const token = jwt.sign(
      {
        id: staff._id,
        role: "staff",
        name: staff.userName
      },
      process.env.SECRETKEY,
      { expiresIn: "1d" }
    );

    return res.json({
      msg: "Login Successfullyl",
      saveData: {
        id: staff._id,
        name: staff.userName,
        role: "staff"
      },
      token
    });

  } catch (error) {

    res.status(500).json({
      msg: error.message
    });

  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const { name, password } = req.body;

    const updateData = { name };

    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      updateData.password = hashedPass;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.json({
      msg: "Profile updated",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//  FORGOT PASSWORD

// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email)
//       return res.status(400).json({ msg: "Email required" });

//     const admin = await User.findOne({ email });
//     if (!admin)
//       return res.status(404).json({ msg: "Admin not found" });


//     const resetToken = crypto.randomBytes(32).toString("hex");

//     admin.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
//     await admin.save({ validateBeforeSave: false });

//     const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });

//     await transporter.sendMail({
//       to: admin.email,
//       subject: "Admin Password Reset",
//       html: `
//         <h3>Password Reset</h3>
//         <p>Click the link below:</p>
//         <a href="${resetLink}">${resetLink}</a>
//         <p>Link expires in 15 minutes</p>
//       `
//     });

//     res.json({ msg: "Reset link sent to Email" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };


const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        msg: "Email required"
      });
    }

    // find admin
    let admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(404).json({
        msg: "Admin not found"
      });
    }

    // SAVE EMAIL FIRST TIME
    if (!admin.email) {
      admin.email = email;
    }

    // check if email matches
    if (admin.email !== email) {
      return res.status(401).json({
        msg: "Email does not match admin account"
      });
    }

    // create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    admin.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await admin.save({ validateBeforeSave: false });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      to: admin.email,
      subject: "Admin Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes</p>
      `
    });

    res.json({
      msg: "Reset link sent to email"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Server error"
    });

  }
};

// RESET PASSWORD

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ msg: "Password reset Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


//  VERIFY TOKEN  

const verifyToken = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  // MUST split Bearer
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired" });
  }


};


// create student id 


const addStudentDetails = async (req, res) => {
  try {
    // 1 Increment counter ONLY when saving
    const counter = await StudentCounter.findOneAndUpdate(
      {},
      { $inc: { lastNumber: 1 } },
      { new: true, upsert: true }
    );

    //  Generate permanent student ID
    const studentId = `KIT-${counter.lastNumber + 10000}`;

    //  Save student WITH ID
    const student = new Student({
      ...req.body,
      studentId,
      uploadPhoto: req.file?.path || null
    });

    await student.save();

    res.status(201).json({
      message: "Student added Successfully",
      student
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createStudentId = async (req, res) => {
  try {
    const counter = await StudentCounter.findOne({});
    const lastNumber = counter?.lastNumber || 0;

    const studentId = `KIT-${lastNumber + 10001}`;

    res.status(200).json({ studentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: 1 });
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// // Get student by ID to update
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // UPDATE student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    Object.assign(student, req.body);

    if (req.file) student.uploadPhoto = req.file.path;

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // DELETE student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne(); // or Student.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Student deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// create employee id

const createEmployeeId = async (req, res) => {
  try {
    const EMPcounter = await EmployeeCounter.findOne({});
    const lastNumber = EMPcounter?.lastNumber || 0;

    const employeeId = `EMP-${lastNumber + 10001}`;

    res.status(200).json({ employeeId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const addEmployeeDetails = async (req, res) => {
  try {
    //  Generate next employee ID
    const EMPcounter = await EmployeeCounter.findOneAndUpdate(
      {},
      { $inc: { lastNumber: 1 } },
      { new: true, upsert: true }
    );

    const numericPart = EMPcounter.lastNumber + 10000;
    const employeeId = `EMP-${numericPart}`;

    //  Create employee with generated ID
    const employee = new Employee({
      ...req.body,
      employeeId,
      uploadPhoto: req.file?.path || null
    });

    await employee.save();

    res.status(201).json({
      message: "Employee added Successfully",
      employee
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const getAllEmployee = async (req, res) => {
  try {
    const employee = await Employee.find().sort({ createdAt: 1 });
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// // Get employee by ID to update
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const data = req.body;

    // assign safely
    employee.firstName = data.firstName;
    employee.lastName = data.lastName;
    employee.email = data.email;

    // number conversions
    employee.workExperience = data.workExperience !== undefined
      ? Number(data.workExperience)
      : employee.workExperience;

    employee.salary = data.salary !== undefined
      ? Number(data.salary)
      : employee.salary;

    employee.annualsalary = data.annualsalary !== undefined
      ? Number(data.annualsalary)
      : employee.annualsalary;

    // file
    if (req.file) {
      employee.uploadPhoto = req.file.path;
    }

    await employee.save();

    res.json(employee);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // DELETE employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.deleteOne(); // or Employee.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Employee deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// ADD Attendance 


const addAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();

    res.status(201).json({
      message: "Attendance added Successfully",
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId", "firstName employeeId email designation")
      .sort({ createdAt: -1 });

    res.status(200).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("employeeId", "firstName employeeId");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE attendance
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    Object.assign(attendance, req.body);
    await attendance.save();

    res.json({
      message: "Attendance updated Successfully",
      attendance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // DELETE attendance
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// customer invoice create
const createCustometInvoiceId = async (req, res) => {
  try {
    const year = new Date().getFullYear().toString().slice(-2);

    //  just read counter
    const counter = await CustomerInvoiceCounter.findOne({ year });
    const lastNumber = counter?.lastNumber || 0;

    const invoiceNumber = (lastNumber + 1).toString().padStart(3, "0");
    const invoiceId = `KIT/${year}/${invoiceNumber}`;

    res.status(200).json({ invoiceId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createCustomer = async (req, res) => {
  try {
    const year = new Date().getFullYear().toString().slice(-2);

    //  increment only when saving customer
    const counter = await CustomerInvoiceCounter.findOneAndUpdate(
      { year },
      { $inc: { lastNumber: 1 } },
      { new: true, upsert: true }
    );

    const invoiceNumber = counter.lastNumber.toString().padStart(3, "0");
    const invoiceId = `KIT/${year}/${invoiceNumber}`;

    const customer = await Customer.create({
      ...req.body,
      InvoiceNo: invoiceId
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// gst


const createInvoice = async (req, res) => {
  try {
    const {
      customerId,
      InvoiceNo,
      GSTIN,
      date,
      items,
      subTotal,
      igst,
      grandTotal
    } = req.body;

    if (!customerId || !InvoiceNo || !items?.length) {
      return res.status(400).json({ message: "Missing invoice data" });
    }

    const subTotalFormatted = Number(subTotal).toFixed(2);
    const igstFormatted = Number(igst).toFixed(2);
    const grandTotalFormatted = Number(grandTotal).toFixed(2);

    //  Save invoice in DB
    await Invoice.create({
      customerId,
      InvoiceNo,
      GSTIN,
      date,
      items,
      subTotal,
      igst,
      grandTotal
    });


    const html = `
    <html>
      <head>
<style>
  * {
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    padding: 40px;
    color: #000;
    font-size: 14px;
  }

  .invoice-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 40px;
  }

  .invoice-details {
    width: 100%;
    margin-bottom: 30px;
  }

  .invoice-details p {
    margin: 6px 0;
    font-size: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    padding:20px;
  }

  table th {
    border: 1px solid #000;
    padding: 10px;
    text-align: center;
    background-color: #f5f5f5;
    font-weight: bold;
  }

  table td {
    border: 1px solid #000;
    padding: 10px;
    text-align: center;
  }

  table td:first-child {
    text-align: left;
  }

  .totals {
    margin-top: 30px;
    width: 100%;
  }

.totals-row {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 8px 0;
}

.label {
  min-width: 120px; 
}

.colon {
  margin: 0 8px;
}

.value {
  margin-left: auto;
  font-weight: 600;
}


  .grand-total {
    margin-top: 20px;
    font-size: 22px;
    font-weight: bold;
    text-align: right;
  }
</style>

      </head>
    <body>
  <br/>
  <br/>
  <br/>
  <div class="invoice-title">INVOICE</div>
  <h3>KITKAT SOFTWARE TECHNOLOGIES<h3>

  <div class="invoice-details">
    <p><strong>Invoice No:</strong> ${InvoiceNo}</p>
    <p><strong>GSTIN:</strong> ${GSTIN}</p>
    <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50%">Description</th>
        <th style="width: 15%">Qty</th>
        <th style="width: 20%">Unit Price(INR)</th>
        <th style="width: 30%">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(i => `
<tr>
  <td>${i.description}</td>
  <td>${i.qty}</td>
  <td>₹${(Number(i.total) / Number(i.qty)).toFixed(2)}</td>
  <td>₹${Number(i.total).toFixed(2)}</td>
</tr>

      `).join("")}
    </tbody>
  </table>
<br/>
<div class="totals">
  <div class="totals-row">
    <span class="label">Sub Total</span>
    <span class="colon">:</span>
    <span class="value">₹${subTotalFormatted}</span>
  </div>

  <div class="totals-row">
    <span class="label">IGST (18%)</span>
    <span class="colon">:</span>
    <span class="value">₹${igstFormatted}</span>
  </div>
</div>
<br/>
  <div class="grand-total">
    Grand Total: ₹${grandTotalFormatted}
  </div>
</body>

    </html>
    `;


    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 0
    });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    //  Send PDF correctly
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=Invoice_${InvoiceNo}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);

  } catch (error) {
    console.error("PDF ERROR 👉", error);
    return res.status(500).json({ message: error.message });
  }
};



const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customerId", "name state")
      .sort({ createdAt: -1 });

    res.status(200).json(invoices);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// create vendor 


const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({
      message: "Vendor created Successfully",
      vendor
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      message: "Vendor updated Successfully",
      vendor
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// create lead 


const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllLeads = async (req, res) => {
  try {
    // const leads = await Lead.find().sort({ createdAt: -1 });
    const leads = await Lead.find().sort({ createdAt: 1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const bulkUploadLeads = async (req, res) => {
  try {
    const { leads } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ message: "No leads data received" });
    }

    const normalize = (row) => {
      const obj = {};
      Object.keys(row).forEach((key) => {
        obj[key.toLowerCase().replace(/\s/g, "")] = row[key];
      });
      return obj;
    };

    //  Normalize all rows first
    const cleaned = leads.map(normalize);

    //  Extract phones
    const phones = cleaned.map(
      (r) => String(r.mobile || r.phonenumber || "")
    );

    //  Find existing in ONE query
    const existing = await Lead.find({
      phoneNumber: { $in: phones },
    });

    const existingSet = new Set(existing.map((e) => e.phoneNumber));

    const newLeads = [];
    const errors = [];

    for (let i = 0; i < cleaned.length; i++) {
      const row = cleaned[i];

      const phone = String(row.mobile || row.phonenumber || "");

      //  Validation
      if (!row.name) {
        errors.push(`Row ${i + 1}: Name missing`);
        continue;
      }

      if (!phone) {
        errors.push(`Row ${i + 1}: Phone missing`);
        continue;
      }

      //  Duplicate check
      if (existingSet.has(phone)) {
        errors.push(`Row ${i + 1}: Already exists (${phone})`);
        continue;
      }

      //  Prevent duplicates inside SAME FILE
      if (newLeads.find((l) => l.phoneNumber === phone)) {
        errors.push(`Row ${i + 1}: Duplicate in file (${phone})`);
        continue;
      }

      //  Date parse
      let date = new Date();
      const val = row.created;

      if (typeof val === "number") {
        date = new Date((val - 25569) * 86400 * 1000);
      } else if (typeof val === "string" && val.includes("-")) {
        const [dd, mm, yyyy] = val.split("-");
        date = new Date(`${yyyy}-${mm}-${dd}`);
      }

      newLeads.push({
        date,
        name: row.name,
        qualification: row.qualification || "",
        yearOfPassing: row.yop || row.yearofpassing || "",
        phoneNumber: phone,
        location: row.location || "",
        course: row.course || "",
        followUpStatus: "No Response",
        detailsSent: row.sent || row.detailssent || "No",
        assignedTo: row.assign || row.assignedto || "",
        source: "Ads",
      });
    }

    //  Insert ONLY clean data
    let inserted = [];
    if (newLeads.length > 0) {
      inserted = await Lead.insertMany(newLeads);
    }

    return res.status(200).json({
      message: "Bulk Upload Completed",
      inserted: inserted.length,
      skipped: errors.length,
      errors,
    });
  } catch (err) {
    console.error(err);

    //  duplicate key error 

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate phone numbers found",
      });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
// 26/03



const exportLeadsToExcel = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    const formatted = leads.map((lead, index) => ({
      No: index + 1,
      Created: new Date(lead.date).toLocaleDateString(),
      Name: lead.name,
      Qualification: lead.qualification,
      YOP: lead.yearOfPassing,
      Mobile: lead.phoneNumber,
      Location: lead.location,
      Course: lead.course,
      FollowUp: lead.followUpStatus,
      Sent: lead.detailsSent,
      Assign: lead.assignedTo,
      Source: lead.source
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Leads.xlsx"
    );

    res.type(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// RECEIPTS


const addStudentCash = async (req, res) => {
  try {
    const cash = new StudentCash(req.body);
    await cash.save();

    res.status(201).json({
      message: "Student Cash Added Successfully ",
      data: cash,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add student cash",
      error: error.message,
    });
  }
};

const getStudentCash = async (req, res) => {
  try {
    const records = await StudentCash.find().populate("studentId");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student cash records",
      error: error.message,
    });
  }
};

const updateStudentCash = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCash = await StudentCash.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCash) {
      return res.status(404).json({
        message: "Student Cash Record Not Found ",
      });
    }

    res.status(200).json({
      message: "Student Cash Updated Successfully ",
      data: updatedCash,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update student cash ",
      error: error.message,
    });
  }
};


const deleteStudentCash = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCash = await StudentCash.findByIdAndDelete(id);

    if (!deletedCash) {
      return res.status(404).json({
        message: "Student Cash Record Not Found ",
      });
    }

    res.status(200).json({
      message: "Student Cash Deleted Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student cash ",
      error: error.message,
    });
  }
};



const addCustomerCash = async (req, res) => {
  try {
    const cash = new CustomerCash(req.body);
    await cash.save();

    res.status(201).json({
      message: "Customer Cash Added Successfully ",
      data: cash,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add customer cash",
      error: error.message,
    });
  }
};

const getCustomerCash = async (req, res) => {
  try {
    const records = await CustomerCash.find().populate("customerId");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customer cash records",
      error: error.message,
    });
  }
};


const updateCustomerCash = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCash = await CustomerCash.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCash) {
      return res.status(404).json({
        message: "Customer Cash Record Not Found ",
      });
    }

    res.status(200).json({
      message: "Customer Cash Updated Successfully ",
      data: updatedCash,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update customer cash ",
      error: error.message,
    });
  }
};


const deleteCustomerCash = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCash = await CustomerCash.findByIdAndDelete(id);

    if (!deletedCash) {
      return res.status(404).json({
        message: "Customer Cash Record Not Found ",
      });
    }

    res.status(200).json({
      message: "Customer Cash Deleted Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete customer cash ",
      error: error.message,
    });
  }
};



const getSingleStudentCash = async (req, res) => {
  try {
    const record = await StudentCash.findById(req.params.id)
      .populate("studentId");

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getSingleCustomerCash = async (req, res) => {
  try {
    const record = await CustomerCash.findById(req.params.id)
      .populate("customerId");

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// interview 

const createInterview = async (req, res) => {
  try {
    const data = {
      ...req.body,
      uploadPhoto: req.file ? req.file.filename : null
    };

    const interview = new Interview(data);
    await interview.save();

    res.status(201).json(interview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* GET ALL */
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: 1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET SINGLE */
const getSingleInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(interview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* DELETE */
const deleteInterview = async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// create staff

const createStaff = async (req, res) => {
  try {
    const { staffName, dateOfJoining, userName, password, comments } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      staffName,
      dateOfJoining,
      userName,
      password: hashedPass,
      comments
    });

    res.status(201).json({
      message: "Staff created Successfully",
      staff
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .populate("staffName", "firstName lastName employeeId");

    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("staffName");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(staff);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({
      message: "Staff updated Successfully",
      staff
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStaff = async (req, res) => {
  try {

    await Staff.findByIdAndDelete(req.params.id);

    res.json({
      message: "Staff deleted Successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const createCourse = async (req, res) => {

  try {

    const { course } = req.body;

    const existingCourse = await Course.findOne({ course });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course already exists"
      });
    }

    const newCourse = new Course(req.body);

    await newCourse.save();

    res.status(201).json(newCourse);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


const getCourses = async (req, res) => {
  try {

    const courses = await Course.find();

    res.status(200).json(courses);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch courses"
    });
  }
};

const updateCourse = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Course updated Successfully",
      course: updatedCourse
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update course"
    });
  }
};


const deleteCourse = async (req, res) => {
  try {

    const { id } = req.params;

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      message: "Course deleted Successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to delete course"
    });
  }
};



// CREATE Employee Type
const createEmployeeType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const existing = await EmployeeType.findOne({ type });

    if (existing) {
      return res.status(400).json({ message: "Type already exists" });
    }

    const newType = await EmployeeType.create({ type });

    res.status(201).json({
      message: "Employee Type created",
      data: newType
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ALL Employee Types
const getEmployeeTypes = async (req, res) => {
  try {
    const types = await EmployeeType.find().sort({ createdAt: -1 });
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getMethodfun,
  postMethodfun,
  loginMethod,
  forgotPassword,
  resetPassword,
  verifyToken,


  createStudentId,
  addStudentDetails,
  getAllStudents,

  createEmployeeId,
  addEmployeeDetails,
  getAllEmployee,



  getStudentById,
  updateStudent,
  deleteStudent,



  getEmployeeById,
  updateEmployee,
  deleteEmployee,


  addAttendance,
  getAllAttendance,

  getAttendanceById,
  updateAttendance,
  deleteAttendance,



  createCustometInvoiceId,
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,


  createInvoice,

  getAllInvoices,


  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,



  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,



  bulkUploadLeads,
  exportLeadsToExcel,


  addStudentCash,
  getStudentCash,
  updateStudentCash,
  deleteStudentCash,
  addCustomerCash,
  getCustomerCash,
  updateCustomerCash,
  deleteCustomerCash,


  getSingleStudentCash,
  getSingleCustomerCash,


  createInterview,
  getInterviews,
  getSingleInterview,
  updateInterview,
  deleteInterview,




  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,


  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,



  updateProfile,


  createEmployeeType,
  getEmployeeTypes,

};










