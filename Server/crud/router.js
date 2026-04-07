const express = require("express");


const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads/");


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

//  multer storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


const { getMethodfun, postMethodfun, loginMethod, forgotPassword, resetPassword, verifyToken,
    createStudentId, addStudentDetails, getAllStudents, createEmployeeId,
    addEmployeeDetails,
    getAllEmployee, updateStudent, getStudentById, deleteStudent,
    getEmployeeById, updateEmployee, deleteEmployee,
    addAttendance, getAllAttendance, getAttendanceById, updateAttendance, deleteAttendance,
    createCustometInvoiceId, createCustomer, getAllCustomers, getCustomerById,
    updateCustomer, deleteCustomer, createInvoice, getAllInvoices,

    createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor,
    createLead,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead,

    bulkUploadLeads, exportLeadsToExcel,
    addStudentCash,
    getStudentCash,
    updateStudentCash,
    deleteStudentCash,
    addCustomerCash,
    getCustomerCash,
    updateCustomerCash,
    deleteCustomerCash, getSingleStudentCash, getSingleCustomerCash,

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

    createCourse, getCourses, updateCourse, deleteCourse, updateProfile, createEmployeeType,
    getEmployeeTypes, } = require("./crud");

const router = express.Router();

router.get("/readData", getMethodfun);
router.post("/postData", postMethodfun);
router.post("/loginData", loginMethod);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.put("/update-profile", verifyToken, updateProfile);


router.get("/students/next-id", verifyToken, createStudentId);
router.post("/students",
    verifyToken,
    upload.single("uploadPhoto"),
    addStudentDetails
);

router.get("/students", verifyToken, getAllStudents);



router.get("/employee/next-id", verifyToken, createEmployeeId);
router.post("/employee",
    verifyToken,
    upload.single("uploadPhoto"),
    addEmployeeDetails
);
router.get("/employee", verifyToken, getAllEmployee);




router.get("/students/:id", verifyToken, getStudentById);

// UPDATE student
router.put(
    "/students/:id",
    verifyToken,
    upload.single("uploadPhoto"),
    updateStudent
)
router.delete("/students/:id", verifyToken, deleteStudent);




router.get("/employee/:id", verifyToken, getEmployeeById);

// UPDATE employee
router.put(
    "/employee/:id",
    verifyToken,
    upload.single("uploadPhoto"),
    updateEmployee
)
router.delete("/employee/:id", verifyToken, deleteEmployee);



// add attendance 
router.post("/attendance", verifyToken, addAttendance);
router.get("/attendance", verifyToken, getAllAttendance);

router.get("/attendance/:id", verifyToken, getAttendanceById);
router.put("/attendance/:id", verifyToken, updateAttendance);
router.delete("/attendance/:id", verifyToken, deleteAttendance);


router.get("/customer/next-id", verifyToken, createCustometInvoiceId);


router.post("/customer", verifyToken, createCustomer);
router.get("/customer", verifyToken, getAllCustomers);
router.get("/customer/:id", verifyToken, getCustomerById);
router.put("/customer/:id", verifyToken, updateCustomer);
router.delete("/customer/:id", verifyToken, deleteCustomer);



router.post("/invoice", verifyToken, createInvoice);

router.get("/invoice", verifyToken, getAllInvoices);




router.post("/vendor", verifyToken, createVendor);
router.get("/vendor", verifyToken, getAllVendors);
router.get("/vendor/:id", verifyToken, getVendorById);
router.put("/vendor/:id", verifyToken, updateVendor);
router.delete("/vendor/:id", verifyToken, deleteVendor);



router.post("/leads", verifyToken, createLead);
router.get("/leads", verifyToken, getAllLeads);
router.get("/leads/:id", verifyToken, getLeadById);
router.put("/leads/:id", verifyToken, updateLead);
router.delete("/leads/:id", verifyToken, deleteLead);




router.post("/leads/bulk", verifyToken, bulkUploadLeads);

router.get("/leads/export-excel", verifyToken, exportLeadsToExcel)




router.post("/student-cash", verifyToken, addStudentCash);

router.get("/student-cash", verifyToken, getStudentCash);

router.put("/student-cash/:id", verifyToken, updateStudentCash);
router.delete("/student-cash/:id", verifyToken, deleteStudentCash);

router.get("/student-cash/:id", verifyToken, getSingleStudentCash);

router.post("/customer-cash", verifyToken, addCustomerCash);

router.get("/customer-cash", verifyToken, getCustomerCash);


router.put("/customer-cash/:id", verifyToken, updateCustomerCash);
router.delete("/customer-cash/:id", verifyToken, deleteCustomerCash);

router.get("/customer-cash/:id", verifyToken, getSingleCustomerCash);




router.post(
    "/interviews",
    verifyToken,
    upload.single("uploadPhoto"),
    createInterview
);

router.get("/interviews", verifyToken, getInterviews);

router.get("/interviews/:id", verifyToken, getSingleInterview);

router.put(
    "/interviews/:id",
    verifyToken,
    upload.single("uploadPhoto"),
    updateInterview
);

router.delete("/interviews/:id", verifyToken, deleteInterview);






router.post("/staff", verifyToken, createStaff);
router.get("/staff", verifyToken, getAllStaff);
router.get("/staff/:id", verifyToken, getStaffById);
router.put("/staff/:id", verifyToken, updateStaff);
router.delete("/staff/:id", verifyToken, deleteStaff);



router.post("/courses", createCourse);
router.get("/courses", getCourses);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);



router.post("/employee-type", verifyToken, createEmployeeType);
router.get("/employee-type", verifyToken, getEmployeeTypes);

module.exports = router;




