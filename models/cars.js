const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    plate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        unique: true,
        index:true,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model("Car",CarSchema)
