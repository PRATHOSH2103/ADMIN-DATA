


import axios from 'axios';
import React, { useEffect, useState } from 'react';


import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";


const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6"];

const Dashboardhome = () => {

    //  STATES 
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [clients, setClients] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const [studentChart, setStudentChart] = useState([]);
    const [employeeChart, setEmployeeChart] = useState([]);
    const [clientChart, setClientChart] = useState([]);
    const [invoiceChart, setInvoiceChart] = useState([]);

    const [activeChart, setActiveChart] = useState("students");

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [selectedDay, setSelectedDay] = useState(null);
    const [eventText, setEventText] = useState("");
    const [events, setEvents] = useState({});
    const [showForm, setShowForm] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);

    
    const [searchValue, setSearchValue] = useState("");

    //  FETCH DASHBOARD DATA 
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const [studentRes, employeeRes, clientRes, invoiceRes] =
                await Promise.all([
                    axios.get("http://localhost:4004/api/students", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),

                    axios.get("http://localhost:4004/api/employee", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),

                    axios.get("http://localhost:4004/api/customer", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),

                    axios.get("http://localhost:4004/api/invoice", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

            setStudents(studentRes.data);
            setEmployees(employeeRes.data);
            setClients(clientRes.data);
            setInvoices(invoiceRes.data);
        } catch (err) {
            console.log("Dashboard Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    useEffect(() => {
        //  STUDENTS (Course Wise) 
        const filteredStudents = students.filter(
            (s) =>
                s.dateOfJoining &&
                new Date(s.dateOfJoining).getFullYear() === Number(selectedYear)
        );

        const courseMap = {};
        filteredStudents.forEach((s) => {
            const course = s.course || "Unknown";
            courseMap[course] = (courseMap[course] || 0) + 1;
        });

        setStudentChart(
            Object.keys(courseMap).map((course) => ({
                name: course,
                value: courseMap[course]
            }))
        );

        //  EMPLOYEES (Designation Wise) 
        const filteredEmployees = employees.filter(
            (e) =>
                e.dateOfJoining &&
                new Date(e.dateOfJoining).getFullYear() === Number(selectedYear)
        );

        const designationMap = {};
        filteredEmployees.forEach((e) => {
            const des = e.designation || "Unknown";
            designationMap[des] = (designationMap[des] || 0) + 1;
        });

        setEmployeeChart(
            Object.keys(designationMap).map((des) => ({
                name: des,
                value: designationMap[des]
            }))
        );

        //  CLIENTS (State Wise Year Filter) 
        const filteredClients = clients.filter(
            (c) =>
                c.createdAt &&
                new Date(c.createdAt).getFullYear() === Number(selectedYear)
        );

        const stateMap = {};
        filteredClients.forEach((c) => {
            const state = c.state || c.city || "Unknown";
            stateMap[state] = (stateMap[state] || 0) + 1;
        });

        setClientChart(
            Object.keys(stateMap).map((state) => ({
                name: state,
                value: stateMap[state]
            }))
        );

        //  INVOICES (Product Wise Year Filter) 
        const filteredInvoices = invoices.filter(
            (inv) =>
                (inv.date || inv.createdAt) &&
                new Date(inv.date || inv.createdAt).getFullYear() ===
                Number(selectedYear)
        );

        const productMap = {};
        filteredInvoices.forEach((inv) => {
            inv.items?.forEach((item) => {
                const product =
                    item.description || item.itemName || item.productName || "Unknown";

                productMap[product] = (productMap[product] || 0) + 1;
            });
        });

        setInvoiceChart(
            Object.keys(productMap).map((product) => ({
                name: product,
                value: productMap[product]
            }))
        );
    }, [students, employees, clients, invoices, selectedYear]);

    //  ACTIVE CHART 
    const chartData =
        {
            students: studentChart,
            employees: employeeChart,
            clients: clientChart,
            invoices: invoiceChart
        }[activeChart] || [];

    // calender

    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    const prevMonth = () =>
        setCurrentDate(new Date(year, month - 1, 1));

    const nextMonth = () =>
        setCurrentDate(new Date(year, month + 1, 1));

    const prevYear = () =>
        setCurrentDate(new Date(year - 1, 0, 1));

    const nextYear = () =>
        setCurrentDate(new Date(year + 1, 0, 1));



    const blanks = Array((firstDay + 6) % 7).fill(null);



    // Helper to format date as YYYY-MM-DD
    const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || {};
        const todayKey = formatDate(new Date());

        // Filter out past dates and keep only next 7 dates
        const futureEvents = Object.keys(savedEvents)
            .filter(date => date >= todayKey)
            .sort()
            .slice(0, 7);

        const cleanedEvents = {};
        futureEvents.forEach(date => cleanedEvents[date] = savedEvents[date]);

        setEvents(cleanedEvents);
        localStorage.setItem("calendarEvents", JSON.stringify(cleanedEvents));

        //  automatically select first upcoming event so it shows after refresh
        if (futureEvents.length > 0) {
            setSelectedDate(futureEvents[0]);
            setSelectedDay(new Date(futureEvents[0]).getDate());
        }
    }, []);


    // Add a new event
    const handleAddEvent = () => {
        if (!selectedDate || eventText.trim() === "") return;

        const updatedEvents = { ...events, [selectedDate]: eventText };

        // Keep only next 7 events
        const next7Events = Object.keys(updatedEvents)
            .sort()
            .slice(0, 7)
            .reduce((acc, key) => ({ ...acc, [key]: updatedEvents[key] }), {});

        setEvents(next7Events);
        localStorage.setItem("calendarEvents", JSON.stringify(next7Events));

        setEventText("");
        setShowForm(false);
    };


    useEffect(() => {
        const handleSearch = () => {
            const value = localStorage.getItem("dashboardSearch") || "";
            setSearchValue(value);
        };

        window.addEventListener("dashboardSearchUpdated", handleSearch);
        handleSearch();

        return () => {
            window.removeEventListener("dashboardSearchUpdated", handleSearch);
        };
    }, []);



    useEffect(() => {

        const value = searchValue?.toLowerCase().trim();

        if (!value) {
            setActiveChart("students");
            return;
        }


        if (!value || value.length < 3) return;

        if (value.startsWith("stu")) {
            setActiveChart("students");
        }
        else if (value.startsWith("emp")) {
            setActiveChart("employees");
        }
        else if (value.startsWith("cli")) {
            setActiveChart("clients");
        }
        else if (value.startsWith("inv")) {
            setActiveChart("invoices");
        }

    }, [searchValue]);



    return (
        <>
            <div id="dash-right">
                <div id="right">
                    <div id="List">
                        <div id="dash-list">
                            <div id="lists">
                                <div id="lists" onClick={() => setActiveChart("employees")}>
                                    Employees < strong > {employees.length}</strong >
                                </div >
                                <div ><img className="icons" src={require("../Home/images/employee.png")} alt="" /></div>
                            </div>
                            <div id="lists">
                                <div id="lists" onClick={() => setActiveChart("students")}>
                                    Students < strong > {students.length}</strong >
                                </div >
                                <div ><img className="icons2" src={require("../Home/images/student.png")} alt="" /></div>
                            </div>
                            <div id="lists">

                                <div id="lists" onClick={() => setActiveChart("clients")}>
                                    Clients <strong>{clients.length}</strong>
                                </div>
                                <div ><img className="icons3" src={require("../Home/images/client.png")} alt="" /></div>
                            </div>
                            <div id="lists">

                                <div id="lists" onClick={() => setActiveChart("invoices")}>
                                    Invoices <strong>{invoices.length}</strong>
                                </div>
                                <div ><img className="icons4" src={require("../Home/images/invoices.png")} alt="" /></div>
                            </div>
                        </div>

                        <div id="pie-chart">
                            <div id="chart">
                                <div id="chart-left" style={{ width: searchValue ? "100%" : "70%" }}>
                                    &nbsp;
                                    <div id="course">
                                        <h5>
                                            {{
                                                students: "Number of Students per Course",
                                                employees: "Number of Employees per Designation",
                                                clients: "Number of Clients per State",
                                                invoices: "Invoice Items Distribution"
                                            }[activeChart]}
                                        </h5>
                                        &nbsp;
                                        &nbsp;
                                        &nbsp;
                                        {/* ⭐ YEAR DROPDOWN */}
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                        >
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const y = currentYear - i;
                                                return <option key={y}>{y}</option>;
                                            })}
                                        </select>
                                    </div>
                                    &nbsp;
                                    {chartData.length === 0 ? (
                                        <p>No Data Available</p>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie data={chartData} dataKey="value" nameKey="name" label>
                                                    {chartData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}

                                </div>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                {!searchValue && (
                                    <div id="chart-right">
                                        <div className="calendar-card">
                                            <h6>Calendar Events</h6>
                                            <div id='event'>
                                                {selectedDate ? (
                                                    events[selectedDate] ? (
                                                        <>
                                                            📅 Date: {selectedDate}
                                                            <br />
                                                            📌 Event: {events[selectedDate]}
                                                        </>
                                                    ) : (
                                                        <>
                                                            📅 Date: {selectedDate}
                                                            <br />
                                                            No Event Added
                                                        </>
                                                    )
                                                ) : (
                                                    "Click a date to add an event"
                                                )}
                                            </div>
                                            {showForm && (
                                                <div className="event-form">
                                                    <h6>
                                                        Add Event for {selectedDay} {monthNames[month]}
                                                    </h6>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter Event Name"
                                                        value={eventText}
                                                        onChange={(e) => setEventText(e.target.value)}
                                                    />

                                                    <button onClick={handleAddEvent}>Add Event</button>

                                                    <button
                                                        onClick={() => {
                                                            setShowForm(false);
                                                            setSelectedDay(null);
                                                        }}
                                                    >
                                                        Back
                                                    </button>
                                                </div>
                                            )}
                                            <div id="cal-date">
                                                <div className="calendar-header">
                                                    <button onClick={prevYear}>«</button>
                                                    <button onClick={prevMonth}>‹</button>
                                                    <span>{monthNames[month]} {year}</span>
                                                    <button onClick={nextMonth}>›</button>
                                                    <button onClick={nextYear}>»</button>
                                                </div>
                                                <div className="calendar-days">
                                                    {days.map(day => (
                                                        <div key={day} className="day-name">{day}</div>
                                                    ))}
                                                </div>
                                                {/* &nbsp; */}

                                                <div className="calendar-dates">
                                                    {blanks.map((v, i) => (
                                                        <div key={i} className="empty"></div>
                                                    ))}

                                                    {Array.from({ length: daysInMonth }, (v, i) => {
                                                        const date = i + 1;
                                                        const fullKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
                                                        const hasEvent = events[fullKey];

                                                        const isToday =
                                                            date === today.getDate() &&
                                                            month === today.getMonth() &&
                                                            year === today.getFullYear();

                                                        const dayIndex = (i + (firstDay + 6) % 7) % 7;
                                                        const isWeekend = dayIndex === 5 || dayIndex === 6;

                                                        return (
                                                            <div
                                                                key={date}
                                                                className={`date 
                                                            ${isToday ? "today" : ""} 
                                                            ${isWeekend ? "weekend" : ""}
                                                            ${hasEvent ? "event-day" : ""}
                                                        `}
                                                                onClick={() => {
                                                                    setSelectedDate(fullKey);
                                                                    setSelectedDay(date);
                                                                    setShowForm(true);
                                                                }}
                                                            >
                                                                {date}

                                                                {hasEvent && (
                                                                    <span className="event-tooltip">
                                                                        📌 {events[fullKey]}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                    {/* ⭐ Next Month Days */}
                                                    {Array.from({ length: 42 - (blanks.length + daysInMonth) }, (_, i) => (
                                                        <div key={`next-${i}`} className="empty next-month">
                                                            {i + 1}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div >

                        </div >
                    </div >
                </div >

            </div >
        </>
    );
}

export default Dashboardhome;












