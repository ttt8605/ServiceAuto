const Services = require('../models/services')
const Postari = require('../models/postari')
const Angajati = require('../models/Angajati')
const prog = require('../models/programari');

const ore = ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];



module.exports.Homepage = async (req, res) => {
    const services = await Services.find({});
    const postari = await Postari.find({});
    const an = await Angajati.find({});
    const programari = await prog.find({})
    // Fetch all booked appointments
    const bookedAppointments = await prog.find({ booked: true });
        
    // Extract booked hours
    const bookedHours = bookedAppointments.map(appointment => appointment.ora);

    // Filter out the booked hours from the available hours
    const availableHours = ore.filter(hour => !bookedHours.includes(hour));
    res.render('home',{services,postari,an,programari,ore: availableHours}); // Ensure 'home' is the correct view file
};

