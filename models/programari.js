const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    name: {  type: String, required: true },
    phone: {  type: String, required: true  },
    date:{ type: String, required: true },
    ora: { type: String, required: true },
    booked: { type: Boolean, default: false },
   
});

module.exports = mongoose.model('appointment', AppointmentSchema);