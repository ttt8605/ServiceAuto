const cloudinary = require('cloudinary').v2;
const{CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})


const Sstorage = new CloudinaryStorage({
    cloudinary,
    params:{
       folder:'services',
        allowedFormats:['jpeg','png','jpg']
    }

});
const PostariStorage = new CloudinaryStorage({
    cloudinary,
    params:{
       folder:'Postari',
        allowedFormats:['jpeg','png','jpg']
    }

});

const AnStorage = new CloudinaryStorage({
    cloudinary,
    params:{
       folder:'Angajati',
        allowedFormats:['jpeg','png','jpg']
    }

});


module.exports={
    cloudinary,
    Sstorage,
    PostariStorage,
    AnStorage
}