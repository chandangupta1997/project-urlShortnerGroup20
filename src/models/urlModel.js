const mongoose =require("mongoose")


const urlSchema =new mongoose.Schema({



    urlCode:{type:String},
    //required:"urlCode is required this will be the base "},

    longUrl:{
        type:String,
        required:"long Url is requried "
    },

    shortUrl:{
        type:String,
        required:"short Url is required "
    }


    

    // we can also add create at deleted at 




},{timestamps:true})


// { urlCode:
//      { mandatory, unique, lowercase, trim },
//       longUrl: {mandatory, valid url}, 
//       shortUrl: {mandatory, unique} }


module.exports= mongoose.model("Url",urlSchema)