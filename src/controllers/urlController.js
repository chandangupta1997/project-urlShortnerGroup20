
const express = require('express')
const validUrl = require('valid-url')

const shortid = require('shortid')
const baseUrl ="localhost:3000"



const urlModel = require("../models/urlModel");
const validator = require("../validator/validations");




const shortLink = async function (req, res) {


    try{
        if (!validator.isValidRequestBody(req.body)) {
        
        
            res.send("empty body")
            return
        }
    
      const { longUrl} = req.body
    
        //// check base url if valid using the validUrl.isUri method
        
    
        // if (!validUrl.isUri(baseUrl)) {
        //     return res.status(401).json('Invalid base URL')
        // } not needed as we have a fix url for application
    
        //if valid we wiil short the url using package shortid
    
        
    
        if(!validUrl.isUri(longUrl)){
            return res.status(401).json('Invalid long  URL')
    
        }
        
    
        //check it exist in db or not 
        let checkUrl =await urlModel.findOne({longUrl:longUrl})
        if(checkUrl){
            res.status(400).send("long url already exists  i.e already shortened ")
            return 
        }
        else{

            var  urlCode = shortid.generate() // jo piche random codes lgte hai 
             // join the generated short code the the base url
            var  shortUrl=baseUrl+"/"+ urlCode
            
        }
    
    
          // invoking the Url model and saving to the DB
    
          let dbData = { longUrl,urlCode,shortUrl
    
          }
    
          const savedData= await urlModel.create(dbData)
    
          res.status(200).send({status:true,data: savedData})
  
    
    }

    catch(error){
        res.status(500).send({status:false,message:error.message})
    }


    


}


const getOriginalLink = async function (req, res) {

    if(!validator.isValidRequestBody(req.params)){
        return res.status(400).send({status:false,message:"please provide value in params that means shorted links "})
    }

    let codeCheck =await urlModel.findOne({urlCode:req.params.urlCode})
    if(codeCheck){

        let OriginalLink = codeCheck.longUrl
        
        
        
        return res.status(400).send({status:true,data:OriginalLink})

    
    


    }
    else{
        return res.status(500).send({staus:false,message:"this short link not found in our db "})
    }


    







}

module.exports.shortLink = shortLink
module.exports.getOriginalLink=getOriginalLink