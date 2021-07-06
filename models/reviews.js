const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
    body:String,
    rating: Number
}
)
module.exports=  mongoose.model('Reviews', ReviewsSchema);