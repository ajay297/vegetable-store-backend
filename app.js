var express = require("express");
var mongoose = require("mongoose");
var app = express();
const multer = require('multer');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const cors = require("cors");
const mongoURI = 'mongodb+srv://Mohan:Mohan@1804@cluster0.qcwbo.mongodb.net/vegetable?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true });

var sabziRoute = require('./routes/sabzi');
var userRoute = require('./routes/user');

app.use(cors());
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use('/sabzi', sabziRoute);
app.use('/users', userRoute);


app.get('/Add', function (req, res) {
    res.render("MohanAdd.ejs");
})

app.listen("5000", function () {
    console.log("Our sabzi app is running");
})