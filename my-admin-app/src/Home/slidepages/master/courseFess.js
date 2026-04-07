
import { TbUsersGroup } from "react-icons/tb";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import { toast } from "react-toastify"

const CourseFess = () => {

    const navigate = useNavigate();

    const [fields, setFields] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const [editData, setEditData] = useState({
        course: "",
        fees: "",
        duration: ""
    });



    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:4004/api/courses"
                );

                const coursesWithEdit = res.data.map(course => ({
                    ...course,
                    edit: false
                }));

                setFields(coursesWithEdit);

            } catch (err) {
                console.log(err);
            }

        };

        fetchCourses();

    }, []);



    const addField = () => {
        setFields([
            ...fields,
            { course: "", fees: "", duration: "", edit: true }
        ]);
    };


    const handleChange = (index, e) => {

        const data = [...fields];
        data[index][e.target.name] = e.target.value;

        setFields(data);
    };



    const handleSave = async (index) => {

        const data = [...fields];
        const courseData = data[index];

        try {

            const res = await axios.post(
                "http://localhost:4004/api/courses",
                {
                    course: courseData.course,
                    fees: courseData.fees,
                    duration: courseData.duration
                }
            );

            data[index] = {
                ...res.data,
                edit: false
            };

            setFields(data);

            toast.success("Course Saved Successfully");

        } catch (err) {

            console.log(err);
            toast.error("Failed to save course");

        }

    };

    const handleEdit = (index) => {

        setEditIndex(index);
        setEditData({
            course: fields[index].course,
            fees: fields[index].fees,
            duration: fields[index].duration
        });

        setShowModal(true);

    };


    const handleDelete = async (index) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this course!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#e74c3c",
        });

        if (!result.isConfirmed) return;

        try {

            const id = fields[index]._id;

            if (!id) {
                toast.error("Course not saved yet");
                return;
            }

            await axios.delete(
                `http://localhost:4004/api/courses/${id}`
            );

            const data = [...fields];
            data.splice(index, 1);
            setFields(data);

            toast.success("Course Deleted Successfully");

        } catch (err) {

            console.log(err);
            toast.error("Delete failed");

        }

    };


    const handleModalChange = (e) => {

        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });

    };



    const handleUpdate = async () => {

        try {

            const id = fields[editIndex]._id;

            const res = await axios.put(
                `http://localhost:4004/api/courses/${id}`,
                editData
            );

            const data = [...fields];

            data[editIndex] = {
                ...res.data.course,
                edit: false
            };

            setFields(data);

            setShowModal(false);

            toast.success("Course Updated Successfully");

        } catch (err) {

            toast.error("Failed to update course");

        }

    };

    return (

        <div id="student-form">

            <div className="header">

                <div id="student"
                    onClick={() => navigate("/dashboard/add-student")}
                >
                    <TbUsersGroup />&nbsp; Add Student
                </div>

                <div id="center-letter">
                    Plan Course Offering
                </div>

                <div className="page"
                    onClick={() => navigate("/dashboard")}
                >
                    <span>Master</span>&nbsp; › &nbsp;<span className="active">Course Fees</span>
                </div>

            </div>

            <br />

            <div className="course-offering-card">

                {fields.length === 0 && (
                    <p>Plan your courses and their prices</p>
                )}

                {fields.map((item, index) => (

                    <div className="course-row" key={index}>

                        <input
                            type="text"
                            name="course"
                            placeholder="Course"
                            value={item.course}
                            disabled={!item.edit}
                            onChange={(e) => handleChange(index, e)}
                        />

                        <input
                            type="text"
                            name="fees"
                            placeholder="Fees"
                            value={item.fees}
                            disabled={!item.edit}
                            onChange={(e) => handleChange(index, e)}
                        />

                        <input
                            type="text"
                            name="duration"
                            placeholder="Duration"
                            value={item.duration}
                            disabled={!item.edit}
                            onChange={(e) => handleChange(index, e)}
                        />

                        <div className="add-filed-icons">

                            <FaSave onClick={() => handleSave(index)} />

                            <FaEdit onClick={() => handleEdit(index)} />

                            <FaTrash onClick={() => handleDelete(index)} />

                        </div>

                    </div>

                ))}

                <div className="field-btn">
                    <div className="add-field-btn" onClick={addField}>
                        Add Field
                    </div>
                </div>

            </div>

            {showModal && (

                <div className="modal">
                    <div className="field-modal-box">

                        <h5>Edit the Course</h5>

                        <label>Course <span id="star">*</span></label>
                        <input
                            className="field-modal-input"
                            type="text"
                            name="course"
                            value={editData.course}
                            onChange={handleModalChange}
                        />
                        &nbsp;
                        <label>Fees <span id="star">*</span></label>
                        <input
                            className="field-modal-input"
                            type="text"
                            name="fees"
                            value={editData.fees}
                            onChange={handleModalChange}
                        />
                        &nbsp;
                        <label>Duration <span id="star">*</span></label>
                        <input
                            className="field-modal-input"
                            type="text"
                            name="duration"
                            value={editData.duration}
                            onChange={handleModalChange}
                        />
                        &nbsp;
                        <div className="field-modal-buttons">

                            <div
                                className="field-edit-btn"
                                onClick={handleUpdate}
                            >
                                Update
                            </div>

                            <div
                                className="field-cancel-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );

};

export default CourseFess;







