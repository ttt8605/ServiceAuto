const programari = require('../models/programari');

module.exports.ProgramareSubmitRequest = async(req,res)=>{
    try {
        const { name,phone,ora,date } = req.body;
        const newProgramare = new programari({name,ora,date ,phone,booked:true});
      await newProgramare.save()
      console.log(newProgramare)
        res.redirect('/')
       
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/*');
    }
}