const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
    title:String,
    distance: Number,
    image: String,
    location: String,
    description: String
})
module.exports = mongoose.model('Destination', DestinationSchema);