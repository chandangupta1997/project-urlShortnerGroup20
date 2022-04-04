
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
    
        // deconstructing 
    
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


const getShortedLink = async function (req, res) {


}

module.exports.shortLink = shortLink
module.exports.getShortedLink = getShortedLink