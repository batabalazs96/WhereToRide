const Destination = require('../models/destination');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken= process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken});

const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res) => {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
};

module.exports.createDestination = async (req, res, next) => {
    const geoData= await geocoder.forwardGeocode({
        query: req.body.destination.location,
        limit: 1
    }).send()
    const destination = new Destination(req.body.destination);
    destination.geometry = geoData.body.features[0].geometry;
    destination.images = req.files.map(f => ({url : f.path, filename : f.filename}))
    destination.author = req.user._id;
    console.log(destination);
    await destination.save();
    req.flash('success', 'Succesfully made a new destination!');
    res.redirect('/destinations');

}

module.exports.renderNewForm = (req, res) => {
    res.render('destinations/new');
}


module.exports.showDestination = async (req, res) => {
    const destination = await Destination.findById(req.params.id).populate({
        path: 'reviews',
        populate: {path: 'author'}   
    }).populate('author');
    if(!destination){
        req.flash('error', 'Cannot find the destination!')
        return res.redirect('/destinations')
    }
    
    res.render('destinations/show', { destination });
}

module.exports.updateDestination = async (req, res) => {
    const {id} = req.params;
    const destination = await Destination.findByIdAndUpdate(id, {...req.body.destination});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    destination.images.push(...imgs);
    await destination.save();
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await destination.updateOne({$pull: {images: {filename:{$in: req.body.deleteImages}}}});
        console.log(destination)
    }
    
    //const destination = await Destination.findByIdAndUpdate(id, req.body.destination);
    req.flash('success', 'Successfully updated destination');
    res.redirect(`/destinations/${destination._id}`);
}


module.exports.deleteDestination = async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted destination');
    res.redirect('/destinations');
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const destination = await Destination.findById(id)
    if(!destination){
        req.flash('error', 'Cannot find the destination what you want edit!')
        return res.redirect('/destinations')
    }
    
    res.render('destinations/edit', { destination });
}