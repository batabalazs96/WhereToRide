const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')

const DestinationSchema = new Schema({
    title:String,
    distance: Number,
    image: String,
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId, ref:'User'
    },
    reviews : [{
        type: Schema.Types.ObjectId, ref:'Reviews'
    }]
});

DestinationSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Destination', DestinationSchema);