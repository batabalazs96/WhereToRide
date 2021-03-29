const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
    title:String,
    distance: Number,
    location: String,
    Description: String
})
module.exports = mongoose.model('Destination', DestinationSchema);