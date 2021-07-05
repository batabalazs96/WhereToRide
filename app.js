const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Destination = require('./models/destination');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('./models/destination');

mongoose.connect('mongodb://localhost:27017/WhereToRide', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/destinations', async (req, res) => {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
})

app.post('/destinations', async (req, res, next) => {
    try {
        const destination = new Destination(req.body.destination);
        await destination.save();
        res.redirect('/destinations')
    }
    catch (e) { next(e) }
})


app.get('/destinations/new', (req, res) => {
    res.render('destinations/new')
})

app.get('/destinations/:id', async (req, res) => {
    const destination = await Destination.findById(req.params.id)
    res.render('destinations/show', { destination });
})

app.put('/destinations/:id', async (req, res) => {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body.destination);
    res.redirect(`/destinations/${destination._id}`);
})

app.delete('/destinations/:id', async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id)
    res.redirect('/destinations')
})

app.get('/destinations/:id/edit', async (req, res) => {
    const destination = await Destination.findById(req.params.id)
    res.render('destinations/edit', { destination });
})

app.use((err, req, res, next) => {
    res.send('Ohh boy, something went wrong')
})

app.listen(3000, () => {
    console.log('Server is running...');
})