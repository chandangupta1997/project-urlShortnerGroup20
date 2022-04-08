const express = require("express");
const validUrl = require("valid-url");

const shortid = require("shortid");
const baseUrl = "http://localhost:3000";

const redis = require("redis");
const { promisify } = require("util");

const urlModel = require("../models/urlModel");
const validator = require("../validator/validations");
const { db } = require("../models/urlModel");

//Connect to redis
const redisClient = redis.createClient(
  18340,
  "redis-18340.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("s77LfKEv2ui2WKebhgNJgYQhIsvEA47y", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createShortLink = async function (req, res) {
  try {
    if (
      !validator.isValidRequestBody(req.body) ||
      !validator.isValid(req.body)
    ) {
      res.status(400).send("empty body");
      return;
    }

    const { longUrl } = req.body

    //// check base url if valid using the validUrl.isUri method

    // if (!validUrl.isUri(baseUrl)) {
    //     return res.status(401).json('Invalid base URL')
    // } not needed as we have a fix url for application

    //if valid we wiil short the url using package shortid

    if (!validUrl.isUri(longUrl.trim())) {
      return res.status(400).json("Invalid long  URL");
    }

    let fetched = await GET_ASYNC(`${longUrl}`);
    if (fetched) {
      let parser = JSON.parse(fetched); // if we dont parse it will give a string value as we stringify while sending it
      return res.send({ msg: "this is fetched redis data short link alredy created ", data: parser });
    } else {
      var urlCode = shortid.generate().toLowerCase(); // jo piche random codes lgte hai
      // join the generated short code the the base url
      var shortUrl = baseUrl + "/" + urlCode;

      // invoking the Url model and saving to the DB

      let dbData = { longUrl, urlCode, shortUrl };

      //sending data to redis

      var savedData = await urlModel.create(dbData);
      let setData = await SET_ASYNC(
        `${longUrl}`,
        JSON.stringify(dbData.shortUrl)
      );

      res.status(200).send({ status: true, data: savedData });
    }
  } catch (error) {
    //check it exist in db or not

    res.status(500).send({ status: false, message: error.message });
  }
};

/////////////////////without redds ////////////////////////

// const getOriginalLink = async function (req, res) {
//   if (!validator.isValidRequestBody(req.params)) {
//     return res
//       .status(400)
//       .send({
//         status: false,
//         message: "please provide value in params that means shorted links ",
//       });
//   }

//   // if any how we can chekck urlCode validation do it
//   if (!validator.isValid(req.params.urlCode)) {
//     return res
//       .status(500)
//       .send({ status: "False", message: "please enter urlCode" });
//   }

//   let codeCheck = await urlModel.findOne({ urlCode: req.params.urlCode });

//   if (codeCheck) {
//     let OriginalLink = codeCheck.longUrl;

//     //return res.status(400).send({status:true,data:OriginalLink})
//     return res.status(301).redirect(OriginalLink);
//   } else {
//     return res
//       .status(404)
//       .send({ staus: false, message: "this short link not found in our db " });
//   }
// };

// const getOriginalLink =async function (req,res){

//   try{

//     let urlCode1 =req.param.urlCode
//   if(!validator.isValid(urlCode1)){
//     return
//   }

//   let fetched =GET_ASYNC(`${urlCode1}`)
//   if(fetched){
//     const parser =JSON.parse(fetched)
//     res.send(parser.longUrl)

//   }

//   else if (urlCode1){
//     let dbCheck =await urlModel.findOne({urlCode:urlCode1})
//     if(!dbCheck){
//       res.send(" your  Url is not in Db ")
//       return}

//     else{
//       let setData = await SET_ASYNC(`${urlCode1}`,JSON.stringify(dbCheck))
//       res.send(dbCheck.longUrl) // you can also send it from redis  but here sending from DB

//     }

//     }

//   }

//   catch(error){res.send(error.message)}

//     }

const getOriginalLink = async function (req, res) {
  try {
    let urlCode1 = req.params.urlCode;
    

    if(!validator.isValid(urlCode1)){

      return res.status(400).send({status:false,message:"please provide valid urlCode"})

    }

    const fetched = await GET_ASYNC(`${urlCode1}`);
    if (fetched) {
      const parser = JSON.parse(fetched);
      console.log("Data Fetched");
      
      //return res.send({ msg: "REdis fetched URl ", link: parser.longUrl });
       return res.status(302).redirect(parser.longUrl)
    } 
    else   {
      
      const dbCheck = await urlModel.findOne({ urlCode: urlCode1 });
      
      if (dbCheck) {
        const SetData = await SET_ASYNC(`${urlCode1}`, JSON.stringify(dbCheck));
        
        //return res.send({ msg: "this is from dB ", link: dbCheck.longUrl });
        return res.status(302).redirect(dbCheck.longUrl)
      } else {
        res
          .status(404)
          .send({ status: false, message: "There is No Short Url Found" });
      }
    } 
    
  } catch (e) {
    res.status(500).send(e.message);
  }
};


module.exports.createShortLink = createShortLink;
module.exports.getOriginalLink = getOriginalLink;
