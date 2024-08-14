const Services = require('../models/services')
const Postari = require('../models/postari')

module.exports.Homepage = async (req, res) => {
    const services = await Services.find({});
    const postari = await Postari.find({});
    res.render('home',{services,postari}); // Ensure 'home' is the correct view file
};

