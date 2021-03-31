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

app.use(express.urlencoded({extended: true}))

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/destinations', async(req, res)=>{
    const destinations = await Destination.find();
    res.render('destinations/index', {destinations});
})

app.post('/destinations', async(req,res) =>{
    const destination = new Destination(req.body.destination);
    await destination.save();
    res.redirect('/destinations')
})

app.get('/destinations/new', (req,res) => {
    res.render('destinations/new')
})

app.get('/destinations/:id', async(req,res) => {
    const destination = await Destination.findById(req.params.id)
    res.render('destinations/show', {destination});
})

app.listen(3000, ()=> {
    console.log('Server is running...');
})