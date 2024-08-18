const mongoose = require('mongoose');

const programariSchema = new mongoose.Schema({
     name: {  type: String, required: true },
    phone: {  type: String, required: true  },
    ora: { type: String, required: true },
    booked: { type: Boolean, default: false },
   
});

module.exports = mongoose.model('programari', programariSchema);