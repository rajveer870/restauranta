const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const loginSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
});

module.exports = mongoose.model('login',loginSchema);