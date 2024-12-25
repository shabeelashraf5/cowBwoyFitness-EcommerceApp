const mongoose = require('../config/config')

const roles = {
    user:'user',
    admin:'admin'
}

const SignUpSchema = new mongoose.Schema({

    fname: {type: String, trim: true, required: true } ,
    lname: {type: String, trim: true, required: true } ,
    email: {type: String, trim: true, unique: true, required: true},
    password: {type:String, required: true},
    role: {type:String, default: roles.user},
    blocked: { type: Boolean, default: false },
    token: {type: String , default: ''},
    otp: { type: String, required: true },
    signup_completed: { type: Boolean, default: false }
  
})


const collection=new mongoose.model("customers" , SignUpSchema)

module.exports =  collection 