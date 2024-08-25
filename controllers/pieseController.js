const Piese = require('../models/piese')
const Cars= require('../models/cars')

const statusPiese = ['S-a comandat','se potriveste','nu se potriveste','retur'];

module.exports.createPiesa = async(req,res)=>{
    const car =   await Cars.findById(req.params.id);
    const piesa = new Piese(req.body.piese);
   car.piese.push(piesa._id);
   await piesa.save();
   await car.save();

   req.flash('success','successfully added a new part')
   res.redirect(`/cars/${car._id}`)
}

module.exports.renderEditPiesaPage = async (req, res) => {
    const { id, piesaId } = req.params;
        // Find the Piesa document
        const piesa = await Piese.findById(piesaId);
        if (!piesa) {
            req.flash('error', 'Piesa not found');
            return res.redirect(`/cars/${id}`);
        }

        // Find the Car document to fetch related information (e.g., status options)
        const car = await Cars.findById(id);
        if (!car) {
            req.flash('error', 'Car not found');
            return res.redirect(`/cars/${id}`);
        }

        // Render the edit page with the Piesa and Car data
        res.render('piese/edit', {
            piesa,
            car,
            statusPiese
        });
  
};


module.exports.updatePiesa = async (req, res) => {
    
        const { id, piesaId } = req.params;
        const updates = req.body;
        const updatedPart = await Piese.findOneAndUpdate({ _id: piesaId }, updates, { new: true, runValidators: true });

        // Set success message and redirect
        req.flash('success', 'Successfully updated the part');
        res.redirect(`/cars/${id}`);
  
};
module.exports.deletePiesa = async(req,res)=>{
    const{id,piesaId}=req.params;
    await Cars.findByIdAndUpdate(id,{$pull:{piese:piesaId}});
    await Piese.findByIdAndDelete(piesaId);
    req.flash('success','successfully deleted')
    res.redirect(`/cars/${id}`);
 }