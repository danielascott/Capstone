// models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  participants: [String],
  location: String,
  description: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);

// config/db.js
const mongoose = require("mongoose");

const mongoURI = "mongodb://your_mongo_uri";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// components/Calendar.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import interactionPlugin from "@fullcalendar/interaction";

// Import your MongoDB integration functions here

function Calendar() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments from MongoDB
    fetchAppointments().then((data) => setAppointments(data));
  }, []);

  // Implement functions for booking, editing, and saving appointments

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={appointments}
      // Render event details, allow editing, etc.
    />
  );
}

export default Calendar;
