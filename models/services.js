const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SericeSchema = new Schema({
    title: String,
    description: String,
});


module.exports = mongoose.model('Service',SericeSchema);