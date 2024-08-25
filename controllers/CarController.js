const cars = require('../models/cars');
const Car = require('../models/cars');

const status = ['Verificare','Se lucreaza','Gata de ridicare'];
const statusPiese = ['S-a comandat','se potriveste','nu se potriveste','retur'];

module.exports.NewCarPage = async (req, res) => {
    res.render('cars/new',{status}); 
};

module.exports.addCarRequest = async (req, res) => {
    try {
        const { model,status,owner,plate } = req.body;
        const newCar = new Car({ model,status,owner,plate });
        newCar.save();
        res.redirect('/cars/all')
       
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/*');
    }
};

module.exports.showAllCars = async(req,res)=>{
    const cars= await Car.find({});
    res.render('cars/all',{cars})
}

module.exports.CarEditPage = async(req,res)=>{
    try{
        const{id}=req.params;
      const cars = await Car.findById(id);
if(req.isAuthenticated()){
        res.render('cars/edit',{cars,status})
}else{
    req.flash('error',"Uppps we couldn't find that page, but we think u might like this one ");
    res.redirect(`/cars/all`);
}
}catch(error){
    req.flash('error', "Ups we couldn't find that car")
    res.redirect('/*')
}
}
module.exports.editCarRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Perform the update
        const updatedCar = await Car.findOneAndUpdate({ _id: id }, updates, { new: true, runValidators: true });

        if (!updatedCar) {
            req.flash('error', 'Car not found');
            return res.redirect('/cars/all');
        }

        req.flash('success', 'Car updated successfully');
        res.redirect('/cars/all');
    } catch (err) {
        req.flash('error', 'An error occurred while updating the car');
        console.error(err);
        res.redirect('/cars/all');
    }
};


module.exports.CarDeleteRequest =  async(req,res)=>{
    try {
        const { id } = req.params;

        const deletedCar = await Car.findByIdAndDelete(id);
        req.flash('success', 'Car deleted successfully');
        res.redirect('/cars/all');
    } catch (error) {
        req.flash('error', 'An error occurred while deleting the car');
        res.redirect('/cars/all');
    }
}


module.exports.searchCarByPlate = async (req, res) => {
    try {
        const { plate } = req.query;
        const car = await Car.findOne({ plate: plate.trim() }); // Find car by plate number
        
        if (car) {
            // Redirect to the individual car page
            res.redirect(`/cars/${car._id}`);
        } else {
            // Redirect to an error page if no car is found
            req.flash('error', 'Car not found');
            res.redirect('/error'); // Adjust the error page route as needed
        }
    } catch (err) {
        req.flash('error', 'An error occurred while searching for the car');
        console.error(err);
        res.redirect('/error'); // Adjust the error page route as needed
    }
};


module.exports.individualCarPage = async (req, res) => {
    const { id } = req.params;
    const cars = await Car.findById(id).populate({
        path: 'piese',
        populate: [
            { path: 'status' },
            { path: 'name' }
        ]
    });
    res.render('cars/individual',{cars,statusPiese})
};