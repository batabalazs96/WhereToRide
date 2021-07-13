const Destination = require('../models/destination');

module.exports.index = async (req, res) => {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
};

module.exports.createDestination = async (req, res, next) => {
    const destination = new Destination(req.body.destination);
    destination.images = req.files.map(f => ({url : f.path, filename : f.filename}));
    destination.author = req.user._id;
    await destination.save();
    console.log(destination);
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
    const destination = await Destination.findById(id, {...req.body.destination});
    //const destination = await Destination.findByIdAndUpdate(id, req.body.destination);
    req.flash('success', 'Successfully deleted destination');
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