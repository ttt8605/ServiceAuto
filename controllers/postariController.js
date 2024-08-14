const Post = require('../models/postari');
const ExpressError =require('../utils/ExpressError');
const {cloudinary}=require("../cloudinary/index")



module.exports.PostariNewPage = async(req,res)=>{
    if(req.isAuthenticated()){
        res.render('postari/new')
    }else{
        req.flash('error',"Uppps we couldn't find that page, but we think u might like this one ");
        res.redirect('/home');
    }
}

module.exports.NewPostRequest = async(req,res)=>{
    try{
       if (req.files && Array.isArray(req.files)) {  
        const newPost = new Post(req.body)
          newPost.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
           await newPost.save();
           req.flash('success','Service created');
          res.redirect('/')
    }else{
        throw new Error('No files attached to the request');
    }
    }catch(err){
        req.flash('error', 'Failed to create Post');
        res.redirect('/'); // Redirect to a relevant page
    }
}


// // Function to format description text
// function formatDescription(text) {
//     return text
//       .replace(/\n/g, '<br>') // Replace newlines with <br>
//       .replace(/ {2}/g, ' &nbsp;') // Replace double spaces with &nbsp;
//       .replace(/ {4}/g, ' &nbsp;&nbsp;&nbsp;&nbsp;') // Replace quadruple spaces with &nbsp;&nbsp;&nbsp;&nbsp;
//       .replace(/ {3}/g, ' &nbsp;&nbsp;&nbsp;'); // Replace triple spaces with &nbsp;&nbsp;&nbsp;
//   }

// module.exports.ServiceIndividual = async (req, res) => {
    
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//         req.flash('error', 'Cannot find that service');
//         return res.redirect('/services');
//     }
//     res.render('services/individual', { 
//         service:{
//             ...service.toObject(),
//             description:formatDescription(service.description)
//         }
//     });

// };


module.exports.PostEditPage = async(req,res)=>{
    try{
        const{id}=req.params;
const post = await Post.findById(id);
if(req.isAuthenticated()){
        res.render('postari/edit',{post})
}else{
    req.flash('error',"Uppps we couldn't find that page, but we think u might like this one ");
    res.redirect(`/`);
}
}catch(error){
    req.flash('error', "Ups we couldn't find that service")
    res.redirect('/*')
}
}

module.exports.PostEditRequest = async(req,res)=>{
    try{ const{id}=req.params;
    const post = await Post.findByIdAndUpdate(id,req.body,{runValidators: true, new: true});
    const imgs =  req.files.map(f => ({ url: f.path, filename: f.filename }))
    post.images.push(...imgs);
    await post.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
       await post.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','post updated');
    res.redirect(`/`)
}catch(err){
    req.flash('error',err);
    res.redirect(`/postari/${post._id}/edit`)
}
   
}


module.exports.PostDeleteRequest =  async(req,res)=>{
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);
        // Check if the deleted drone has images and delete them from Cloudinary
        if (deletedPost.images && Array.isArray(deletedPost.images)) {
            for (let image of deletedPost.images) {
                try {
                    const result = await cloudinary.uploader.destroy(image.filename);
                
                } catch (error) {
                    console.error(`Error deleting image ${image.filename}:`, error);
                }
            }
        }

        req.flash('success', 'Post deleted successfully');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'An error occurred while deleting the Post');
        res.redirect('/');
    }
}