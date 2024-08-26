
const mongoose = require('mongoose');
const{Schema}=mongoose;


const ImageSchema = new Schema({
    url:String,
    filename:String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
 })

const AngajatiSchema = new Schema({
name:{
    type:String,
    required:true
},
role:{
    type:String,
    required:true
},
about:{
    type:String,
    required:true
},
images:[ImageSchema]

})

const Angajati = mongoose.model('Angajati',AngajatiSchema);
module.exports = Angajati;