const mongoose = require("mongoose");
const Connect = require("../DB/config.js");

Connect()

const UserSchema = new mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
})

const UserModel = mongoose.model("user",UserSchema);

module.exports = UserModel;
