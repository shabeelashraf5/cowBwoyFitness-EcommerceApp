const mongoose = require('../config/config')

const BannerSchema = new mongoose.Schema({
   
   
    image: [{ type: String }],
  

})



const collectionbanner=new mongoose.model("banner" , BannerSchema)

module.exports =  collectionbanner