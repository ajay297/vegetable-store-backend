var express = require("express");
var mongoose = require("mongoose");
var app = express();
const methodOverride = require('method-override');
const fileupload = require('express-fileupload');

var sabziRoute = require('./routes/sabzi');
var userRoute = require('./routes/user');

const cors = require("cors");
app.use(cors());
const mongoURI = 'mongodb+srv://Mohan:Mohan@1804@cluster0.qcwbo.mongodb.net/vegetable?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true });




app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(
    fileupload({
        useTempFiles: true,
    })
);
app.use('/sabzi', sabziRoute);
app.use('/users', userRoute);
app.get('/', (req, res) => {
    res.send("hello");
})


app.get('/Add', function (req, res) {
    res.render("MohanAdd.ejs");
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("Our sabzi app is running");
});