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
           req.flash('success','Post created');
          res.redirect('/')
    }else{
        throw new Error('No files attached to the request');
    }
    }catch(err){
        req.flash('error', 'Failed to create Post');
        res.redirect('/'); // Redirect to a relevant page
    }
}


const formatDescription = (text) => {
    if (!text) return ''; // Return an empty string if the text is undefined or null
    
    // Trim the text to remove leading/trailing whitespace and ensure there's no newline at the end
    return text
      .trim()
      .replace(/\n+$/, '') // Remove any trailing newlines
      .replace(/\n/g, '<br>') // Replace remaining newlines with <br>
      .replace(/ {4}/g, ' &nbsp;&nbsp;&nbsp;&nbsp;') // Replace quadruple spaces with &nbsp;&nbsp;&nbsp;&nbsp;
      .replace(/ {3}/g, ' &nbsp;&nbsp;&nbsp;') // Replace triple spaces with &nbsp;&nbsp;&nbsp;
      .replace(/ {2}/g, ' &nbsp;'); // Replace double spaces with &nbsp;
  };


  module.exports.PostIndividual = async (req, res) => {
    
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Cannot find that post');
        return res.redirect('/');
    }
    res.render('postari/individual', { 
        post:{
            ...post.toObject(),
            description:formatDescription(post.description)
        }
    });

};


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
    req.flash('error', "Ups we couldn't find that post")
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