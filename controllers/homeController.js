const Services = require('../models/services')


module.exports.Homepage = async (req, res) => {
    const services = await Services.find({});
    res.render('home',{services}); // Ensure 'home' is the correct view file
};

module.exports.ServiceIndividual = async (req, res) => {
    try {
        const service = await Services.findById(req.params.id);

        if (!service) {
            req.flash('error', 'Cannot find that service');
            return res.redirect('/');
        }

        res.render('services/individual', { 
            service: {
                ...service.toObject(),
                description: formatDescription ? formatDescription(service.description) : service.description
            }
        });
        
    } catch (error) {
        console.error('Error finding service:', error); // Logging the error for debugging
        req.flash('error', 'Something went wrong. Please try again later.');
        res.redirect('/');
    }
};
