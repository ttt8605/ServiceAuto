
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,  // Removes any extra whitespace from the input
    },
    status: {
        type: String,
        required: true,
        enum: ['S-a comandat','se potriveste','nu se potriveste','retur'],  // Example allowed statuses
    }
});

module.exports = mongoose.model("Piesa",partSchema); 