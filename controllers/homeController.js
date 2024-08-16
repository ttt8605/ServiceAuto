const Services = require('../models/services')
const Postari = require('../models/postari')
const Angajati = require('../models/Angajati')
module.exports.Homepage = async (req, res) => {
    const services = await Services.find({});
    const postari = await Postari.find({});
    const an = await Angajati.find({});
    res.render('home',{services,postari,an}); // Ensure 'home' is the correct view file
};

