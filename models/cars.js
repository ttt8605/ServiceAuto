const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Piesa = require('./piese')

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
    piese: [{ type: Schema.Types.ObjectId, ref: 'Piesa' }]
});


CarSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Piesa.deleteMany({
            _id: {
                $in: doc.piese
            }
        });
    }
});
module.exports = mongoose.model("Car",CarSchema)
