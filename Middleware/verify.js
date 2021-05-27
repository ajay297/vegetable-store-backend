var jwt = require('jsonwebtoken');
var config ="qwertyuiopasdfghjklzxcvbnm1234567890";
var customer=require("../models/userdata");

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token||token==="null")
  {
    console.log("GUSSA");
    return res.status(400).send({error:"Login First"});

  }
    
  jwt.verify(token, config, function(err, payload) {
    if (err)
    return res.status(500).send({error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = payload._id;
    next();
  });
}

function isLoggedIn(req,res,next)
{
     var token = req.headers['x-access-token'];
    if (!token)
      return next();

    jwt.verify(token, config, function(err, payload) {
      if (err)
      return next();

      // if everything good, save to request for use in other routes
      req.userId = payload.id;
      console.log(payload._id);
      res.send({error:"Already Logged_In"});
    });
}

function Adminhai(req,res,next)
{
  var token = req.headers['x-access-token'];
    if (!token)
      return res.status(400).send({error:"Login First"});

    jwt.verify(token, config, function(err, payload) {
      if (err)
      return res.status(400).send({error:"Login First"});

      // if everything good, save to request for use in other routes
      req.userId = payload.id;
      var admin=customer.findById(payload._id,function(err,found){
        console.log(found);
        if(found._id===req.userId)
           return next();
        else
           res.send("U dont have permission to do this");
      })
    });
}


module.exports={isLoggedIn,verifyToken,Adminhai};
