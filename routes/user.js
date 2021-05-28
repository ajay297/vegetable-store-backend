var express = require("express");
var mongoose = require("mongoose");
var customer = require("../models/userdata");
var feedback = require("../models/feedback");
var jwt = require("jsonwebtoken");
var app = express.Router();
var bcrypt = require("bcryptjs");
var saltRounds = 10;
var config = "qwertyuiopasdfghjklzxcvbnm1234567890";
var VerifyToken = require('../Middleware/verify');

app.get("/", function (req, res) {
  customer.find({}, function (err, found) {
    if (err)
      res.status(400).send(err);
    else
      res.send(found);
  })
})

app.get("/verifykro", VerifyToken.verifyToken, function (req, res) {
  customer.findById(req.userId, function (err, found) {
    if (err)
      res.status(400).send(err);
    else {
      console.log(found);
      res.send(found);
    }
  })
})

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var email = req.body.email;
    var password = hash;
    var address = req.body.address;
    var city = req.body.city;
    var zip = req.body.zip;
    var phone = req.body.phone;
    var item = { firstName: firstName, lastName: lastName, userName: userName, email: email, password: password, address: address, city: city, zip: zip, phone: phone }
    customer.find({ email: email }, function (err, found) {
      if (found.length > 0)
        res.status(400).send({ error: "Email is already Registered" });
      else {
        customer.create(item, function (err, new_customer) {
          if (err)
            res.status(400).send({ error: err });
          else
            res.send({ message: "Registration Successful" });
        });
      }
    })
  });
})


app.post("/login", VerifyToken.isLoggedIn, function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password)
    return res.status(400).send({ error: "Enter all inputs" });
  customer.findOne({ email: email }, function (err, found) {
    if (found == null)
      res.status(400).send({ error: "Email is not registered" });
    else {
      bcrypt.compare(password, found.password, function (err, result) {
        if (result == true) {
          const token = jwt.sign({ _id: found._id }, config, { expiresIn: 86400 });
          res.send({ token: token });
        }
        else
          res.send({ error: "Wrong Password" });
      })
    }
  });
})

app.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});


app.post("/contact", VerifyToken.verifyToken, function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var item = { name: name, email: email, message: message };
  feedback.create(item, function (err, hogya) {
    if (err)
      res.send({ error: err });
    else
      res.send(hogya);
  })
})

app.get("/:customernaam", function (req, res) {
  console.log("YEAH");
  customer.findById(req.params.customernaam).populate("orders").exec(function (err, payagaya) {
    if (err)
      res.status(400).send(err);
    else if (payagaya.length === 0)
      res.status(400).send(req.params.customernaam.toUpperCase() + " Not Found");
    else {
      console.log(payagaya);
      res.send(payagaya);
    }

  })
})

app.put("/:id", function (req, res) {
  customer.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, updated_user) {
    if (err)
      res.status(400).send({ error: err });
    else {
      console.log("updated");
      res.status(400).send({ message: "Updated" });
    }
  });
});

app.delete("/:id", function (req, res) {
  customer.findByIdAndRemove(req.params.id, function (err, deleted_user) {
    if (err)
      res.status(400).send(err);
    else {
      console.log("deleted");
      res.send(deleted_user);
    }
  });
});


app.get('*', (req, res) => {
  res.status(404).send('404 NOTHING TO SEE HERE...')
});


module.exports = app;
