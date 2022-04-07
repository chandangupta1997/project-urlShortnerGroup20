const { Router } = require('express');
const express = require('express');
const route = express.Router();
const urlController=require("../controllers/urlController")




route.post("/url/shorten",urlController.createShortLink)

route.get("/:urlCode",urlController.getOriginalLink)






module.exports =route;

