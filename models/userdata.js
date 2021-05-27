var mongoose=require("mongoose");
var OrderSchema=require("./orders");

var user=new mongoose.Schema({
    firstName:String,
    lastName:String,
    userName:String,
    email:String,
    password:String,
    address:String,
    city:String,
    zip:Number,
    phone:Number,
    orders:
    [{
       type:mongoose.Schema.Types.ObjectId,
       ref:OrderSchema
    }]
});

customer=mongoose.model("customer",user);

module.exports=customer;