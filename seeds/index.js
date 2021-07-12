const express = require('express')
const mongoose = require('mongoose')
const Destination = require('../models/destination')
const {descriptors, places} = require('../seeds/seedHelpers')
const cities = require('../seeds/cities')

mongoose.connect('mongodb://localhost:27017/WhereToRide', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected")
});

const app = express();


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Destination.deleteMany({});
    for (let i = 0; i < 50; i++) {
         const random100 = Math.floor(Math.random()*100)
         const destination = new Destination({
             author: '60ec574c11a6fe07608987bd',
             title: `${cities[random100].city}`,
             distance: random100,
             image: "https://source.unsplash.com/collection/483251",
             description: `${sample(descriptors)}`
            })
        await destination.save();
        console.log(destination)
    }
}
seedDB();


