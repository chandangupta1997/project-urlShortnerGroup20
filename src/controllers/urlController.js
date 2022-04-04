
const express = require('express')
const validUrl = require('valid-url')

const shortid = require('shortid')



const urlModel = require("../models/urlModel");
const validator = require("../validator/validations");


const baseUrl = 'http:localhost:3000'; //'https:shortsme.com'

const shortLink = async function (req, res) {


    try{
        if (!validator.isValidRequestBody(req.body)) {
        
        
            res.send("empty body")
            return
        }
    
        // deconstructing 
    
        var { longUrl,urlCode} = req.body
    
        //// check base url if valid using the validUrl.isUri method
    
        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).json('Invalid base URL')
        }
    
        //if valid we wiil short the url using package shortid
    
       var urlCode = shortid.generate() // jo piche random codes lgte hai 
    
        if(!validUrl.isUri(longUrl)){
            return res.status(401).json('Invalid long  URL')
    
        }
    
        //check it exist in db or not 
        let url =await urlModel.findOne({longUrl:longUrl})
        if(url){
            res.status(400).send("long url already exists ")
            return 
        }
        else{
             // join the generated short code the the base url
            var  shortUrl=baseUrl+" /"+ urlCode
            
        }
    
    
          // invoking the Url model and saving to the DB
    
          let xyz = { longUrl,baseUrl,shortUrl
    
          }
    
          const resSend= await urlModel.create(xyz)
    
          res.status(200).send({status:true,data:{resSend}})
       
    
    
    
    
    
    
    
    
            
        
        
    
    
    
    
    
    
    }

    catch(error){
        res.status(500).send({status:false,message:error.message })
    }


    


}


const getShortedLink = async function (req, res) {


}

module.exports.shortLink = shortLink
module.exports.getShortedLink = getShortedLink