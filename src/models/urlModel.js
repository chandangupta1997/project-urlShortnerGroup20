const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    urlCode: { type: String, 
      required: "url Code Is Required  ",
       trim: true,
      },

    longUrl: {
      type: String,
      required: "long Url is requried ",
      trim: true,
    },

    shortUrl: {
      type: String,
      required: "short Url is required ",
      trim: true,
    }
  }
   
);

// { urlCode:
//      { mandatory, unique, lowercase, trim },
//       longUrl: {mandatory, valid url},
//       shortUrl: {mandatory, unique} }

module.exports = mongoose.model("Url", urlSchema);
