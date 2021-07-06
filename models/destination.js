const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
    title:String,
    distance: Number,
    image: String,
    location: String,
    description: String,
    reviews : [{
        type: Schema.Types.ObjectId, ref:'Reviews'
    }]
});
module.exports = mongoose.model('Destination', DestinationSchema);