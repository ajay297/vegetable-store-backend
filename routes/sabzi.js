var express = require("express");
var mongoose = require("mongoose");
var Order = require("../models/orders");
var app = express.Router();
var VerifyToken = require("../Middleware/verify");
var store = require("../models/dbitem");
var customer = require("../models/userdata");
var cloudinary = require("cloudinary");


cloudinary.config({
  cloud_name: "mehta1234",
  api_key: "392366357978565",
  api_secret: "kfu13ETDFltzffe6xgL472EDIL0",
});

app.get("/", function (req, res) {
  store.find({}, function (err, found) {
    if (err) res.status(400).send(err);
    else res.send(found);
  });
});

app.post("/create", (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var imagwa = req.files.imageName;
  console.log(req.files);

  cloudinary.uploader.upload(imagwa.tempFilePath, function (error, result) {
    if (error) {
      var imageurl = error.url;
      var item = { name: name, price: price, image: imageurl };
      console.log(item);
      if (!name || !price || !imageurl) return res.send("Enter all fields");
      else {
        store.create(item, function (err, new_item) {
          if (err) res.status(400).send(err);
          else {
            res.send(new_item);
          }
        });
      }
    }
  });
});

app.get("/:naamsabzi", function (req, res) {
  store.findById(req.params.naampost, function (err, payagaya) {
    if (err) res.status(400).send(err);
    else if (payagaya.length === 0)
      res.status(400).send(req.params.naamsabzi.toUpperCase() + " Not Found");
    else res.send(payagaya);
  });
});

app.put("/:id", VerifyToken.verifyToken, function (req, res) {
  store.findById(req.params.id, function (err, found) {
    if (found != undefined && req.userId == found.author) {
      blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        function (err, updated_item) {
          if (err) res.status(400).send(err);
          else {
            console.log("updated");
            res.send(updated_item);
          }
        }
      );
    } else res.status(404).send("U dont have permission to do this");
  });
});

app.delete("/:id", VerifyToken.verifyToken, function (req, res) {
  store.findById(req.params.id, function (err, found) {
    if (req.userId == found.author) {
      store.findByIdAndRemove(req.params.id, function (err, deleted_item) {
        if (!deleted_item) res.status(400).send("Item Not Found");
        else {
          console.log("deleted");
          res.send(deleted_item);
        }
      });
    } else res.send("U dont have permission to do this");
  });
});

app.post("/order/:id", function (req, res) {
  const item = req.body.product;
  const order = new Order();
  order.product = item;
  order.receiver_name = req.body.firstName + " " + req.body.lastName;
  order.address = req.body.address;
  order.tracking_no = req.body.tracking_no;
  order.logistic_company = req.body.logistic_company;
  order.shipping_cost = req.body.shipping_cost;
  order.created_at = req.body.created_at;
  order.dispatched_at = req.body.dispatched_at;
  order.status = req.body.status;
  order.zip = req.body.zip;
  order.city = req.body.city;
  customer.findById(req.params.id, function (err, payagaya) {
    if (err) res.send(err);
    else {
      order.save(function (err, found) {
        if (err) res.status(400).send(err);
        else {
          payagaya.orders.push(found);
          payagaya.save();
          res.send({ message: "Order Placed Successfully" });
        }
      });
    }
  });
});

app.get("*", (req, res) => {
  res.status(404).send("404 NOTHING TO SEE HERE...");
});

module.exports = app;
