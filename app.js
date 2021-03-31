const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Destination = require('./models/destination');

mongoose.connect('mongodb://localhost:27017/WhereToRide', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected")
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/destination', async(req, res)=>{
    const destinations = await Destination.find();
    res.render('destinations/index', {destinations});
})

app.get('/destination/:id', async(req,res) => {
    const destination = await Destination.findById(req.params.id)
    res.render('destinations/show', {destination});
})

app.listen(3000, ()=> {
    console.log('Server is running...');
})