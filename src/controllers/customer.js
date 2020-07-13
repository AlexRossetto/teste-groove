const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const redisController = require('./redis');
var _ = require('lodash');

module.exports = {
  async store(req,res) {
    if (req.body.hasOwnProperty("customer_key") && req.body.hasOwnProperty("customer_name")) { 
      try {
        let retornoToken = await axios({
          method: 'post',
          url: 'https://groove-signer.herokuapp.com/auth/login',
         headers: {
            'Content-Type': 'application/json',
        },
         data: {
            username: 'groover',
            password: 'groove@tech',
         },
          json: true,
        })

        const body = {
          "entity": {
            "customer_key": req.body.customer_key,
            "customer_name": req.body.customer_name,
            },   
        }
  
        let retornoSign = await axios({
          method: 'post',
          url: 'https://groove-signer.herokuapp.com/sign',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${retornoToken.data.token}`
        },
          data: body,
          json: true,
        })
    
        let uid = uuidv4();
    
        const customer = {
          "id": uid,
          "customer_key": retornoSign.data.entity.customer_key,
          "customer_name": retornoSign.data.entity.customer_name,
          "signature": retornoSign.data.signature,
        }
        redisController.save(customer)
        res.status(200).json(customer)
    
      } catch(e) {
       res.status(500).json(e.message)
    }
    } else {
      res.status(400).json({error: "Body request is incorrect"})
    }   
 },

 async show(req, res) {
   try {
    let customerById = await redisController.get(req.params);
    if(!_.isEmpty(customerById) && !_.isNil(customerById)) {
      res.status(200).json(customerById)
    } else {
      res.status(404).json({ "error" : "404 NOT FOUND" })
    }
   }
  catch(e) {
    res.status(500).json({ "error" : e.message });
  }
 },

 async update(req,res) {
    if (req.body.hasOwnProperty("customer_key") && req.body.hasOwnProperty("customer_name")) {
      try {
        let retornoToken = await axios({
          method: 'post',
          url: 'https://groove-signer.herokuapp.com/auth/login',
          headers: {
            'Content-Type': 'application/json',
        },
         data: {
          username: 'groover',
          password: 'groove@tech',
         },
          json: true,
        })
      
        let customerById = await redisController.get(req.params);
    
        if(_.isEmpty(customerById) || _.isNil(customerById)) {
          res.status(404).json({error: "404 not found"})
        } else {
      
        const body = {
          "entity": {
            "customer_key": customerById.customer_key,
            "customer_name": customerById.customer_name,
            },   
          }
       
          let retornoSign = await axios({
            method: 'post',
            url: 'https://groove-signer.herokuapp.com/sign',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${retornoToken.data.token}`
          },
            data: body,
            json: true,
          })
      
          let customerUpdate = {
          "id": customerById.id,
          "customer_key": req.body.customer_key,
          "customer_name": req.body.customer_name,
          "signature": retornoSign.data.signature,
          }

          redisController.update(customerUpdate)
          res.status(200).json(customerUpdate)
        }
       } catch(e) {
          res.status(500).json({ error: e.message})
       }
    } else {
      res.status(400).json({error: "Body request is incorrect"})
    }
  }
}