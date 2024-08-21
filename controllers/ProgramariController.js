const programari = require('../models/programari');
const moment = require('moment')
module.exports.ProgramareSubmitRequest = async(req,res)=>{
    try {
        const { name,phone,ora,date } = req.body;
        const newProgramare = new programari({name,ora,date ,phone,booked:true});
      await newProgramare.save()
        res.redirect('/')
       
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/*');
    }
}

module.exports.allAppointmentsPage = async(req,res)=>{
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const dd = String(today.getDate()).padStart(2, '0');
    
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    
    const appointments = await programari.find({}).sort({date:1,ora:1})
    res.render('appointments/all',{appointments,formattedToday})
}


module.exports.AppointmentDeleteRequest =  async(req,res)=>{
    try {
        const { id } = req.params;
        const deleteApt = await programari.findByIdAndDelete(id);
        req.flash('success', 'Apt deleted successfully');
        res.redirect('/programare');
    } catch (error) {
        req.flash('error', 'An error occurred while deleting the apt');
        res.redirect('/programare');
    }
}