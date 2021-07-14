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
             description: `${sample(descriptors)}`,
             images: [
                {
                  url: 'https://res.cloudinary.com/diavkvh4w/image/upload/v1626206710/WhereToRide/xjlit8vcu7k2mhhse7cu.png',
                  filename: 'WhereToRide/xjlit8vcu7k2mhhse7cu'
                },
                {
                  url: 'https://res.cloudinary.com/diavkvh4w/image/upload/v1626206710/WhereToRide/n1jkpc0v8noella9yttk.png',
                  filename: 'WhereToRide/n1jkpc0v8noella9yttk'
                },
                {
                  url: 'https://res.cloudinary.com/diavkvh4w/image/upload/v1626206710/WhereToRide/qhhs36li59dnd3rsgaho.png',
                  filename: 'WhereToRide/qhhs36li59dnd3rsgaho'
                }
              ]
            })
        await destination.save();
        console.log(destination)
    }
}
seedDB();


