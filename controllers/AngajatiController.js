const Angajati= require('../models/Angajati');
const ExpressError =require('../utils/ExpressError');
const {cloudinary}=require("../cloudinary/index")



module.exports.AngajatiNewPage = async(req,res)=>{
    if(req.isAuthenticated()){
        res.render('angajati/new')
    }else{
        req.flash('error',"Uppps we couldn't find that page, but we think u might like this one ");
        res.redirect('/home');
    }
}

module.exports.NewAnRequest = async(req,res)=>{
    try{
       if (req.files && Array.isArray(req.files)) {  
        const newAn = new Angajati(req.body)
          newAn.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
           await newAn.save();
           req.flash('success','Angajat created');
          res.redirect('/')
    }else{
        throw new Error('No files attached to the request');
    }
    }catch(err){
        req.flash('error', 'Failed to create Post');
        res.redirect('/'); // Redirect to a relevant page
    }
}



module.exports.AnEditPage = async(req,res)=>{
    try{
        const{id}=req.params;
const an = await Angajati.findById(id);
if(req.isAuthenticated()){
        res.render('angajati/edit',{an})
}else{
    req.flash('error',"Uppps we couldn't find that page, but we think u might like this one ");
    res.redirect(`/`);
}
}catch(error){
    req.flash('error', "Ups we couldn't find that Angajat")
    res.redirect('/*')
}
}

module.exports.AnEditRequest = async(req,res)=>{
    try{ const{id}=req.params;
    const an= await Angajati.findByIdAndUpdate(id,req.body,{runValidators: true, new: true});
    const imgs =  req.files.map(f => ({ url: f.path, filename: f.filename }))
    an.images.push(...imgs);
    await an.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
       await an.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Angajat updated');
    res.redirect(`/`)
}catch(err){
    req.flash('error',err);
    res.redirect(`/angajati/${an._id}/edit`)
}
   
}


module.exports.AnDeleteRequest =  async(req,res)=>{
    try {
        const { id } = req.params;

        const deletedAn = await Angajati.findByIdAndDelete(id);
        // Check if the deleted drone has images and delete them from Cloudinary
        if (deletedAn.images && Array.isArray(deletedAn.images)) {
            for (let image of deletedAn.images) {
                try {
                    const result = await cloudinary.uploader.destroy(image.filename);
                
                } catch (error) {
                    console.error(`Error deleting image ${image.filename}:`, error);
                }
            }
        }

        req.flash('success', 'Angajati deleted successfully');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'An error occurred while deleting the Angajat');
        res.redirect('/');
    }
}