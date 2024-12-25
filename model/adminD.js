const mongoose = require('../config/config')

const addAdminSchema = new mongoose.Schema({
    
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    isManager:{ type: Boolean, default: false}
  });
  

const collectionadmin=new mongoose.model("admin" , addAdminSchema)

module.exports =  collectionadmin

