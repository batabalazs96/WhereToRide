const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')

const ImageSchema= new Schema({
    url : String,
    filename : String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const DestinationSchema = new Schema({
    title:String,
    distance: Number,
    images: [ImageSchema],
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    description: String,
    author: {
        type: Schema.Types.ObjectId, ref:'User'
    },
    reviews : [{
        type: Schema.Types.ObjectId, ref:'Reviews'
    }]
}, opts);

DestinationSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/destinations/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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