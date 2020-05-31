const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = '../../ssh/venkat_private_key';


// CREATE
router.post('/', async (req, res) => {

    try{
        validateToken(req.headers.authorization);
        // User.create()
        let hashedpassword = await hashPassword(req.body.newData.password);
        // console.log(hashedpassword);
        User.create(
            {
                name: req.body.newData.name,
                email: req.body.newData.email,
                password: hashedpassword
            },
            (err, data) =>{
            sendResponse(res,err,data);
            }
        );
    } catch(err){
        res.json({
            message: err
        })
    }
   
})

router.route('/:id')
// READ
.get((req,res)=>{
    // console.log(req.headers);
    try{
        validateToken(req.headers.authorization);
        // User.findById()
        User.findById(req.params.id,(err, data) =>{
            sendResponse(res,err,data);
        });
    } catch(err){
        res.json({
            message: err
        })
    }
})
// UPDATE
.put( async (req,res) => {

    try{
        validateToken(req.headers.authorization);
        // User.findByIdAndUpdate()
        let hashedpassword = await hashPassword(req.body.newData.password);
        User.findByIdAndUpdate(req.params.id, 
            {
                name: req.body.newData.name,
                email: req.body.newData.email,
                password: hashedpassword
            },
            {
            new: true
            },
            (err, data) => {
            sendResponse(res,err,data);
            }
        )
    } catch(err){
        res.json({
            message: err
        })
    }
})
// DELETE
.delete((req,res)=>{

    try{
        validateToken(req.headers.authorization);
        // User.findByIdAndDelete()
        User.findByIdAndDelete(req.params.id, (err, data) => {
            sendResponse(res,err,data);
        })
    } catch(err){
        res.json({
            message: err
        })
    }
})

function sendResponse(res,err,data){
  if (err){
    res.json({
      success: false,
      message: err
    })
  } else if (!data){
    res.json({
      success: false,
      message: "Not Found"
    })
  } else {
    res.json({
      success: true,
      data: data
    })
  }
}

async function hashPassword(userPassword){
    const salt = await bcrypt.genSalt(saltRounds);
    // console.log(userPassword);
    let hashedPassword = await bcrypt.hash(userPassword,salt);
    return hashedPassword;
}

 function validateToken(token){
    try{
        if(token){
            token = token.split(" ");
            // console.log(`token[1] is: ${token[1]}`);
            let secret = fs.readFileSync(privateKey);
            let tokenDetails = jwt.verify(token[1], secret, {algorithms: ['RS256']});
            // console.log(`tokenDetails are: ${JSON.stringify(tokenDetails)}`);
            return true;
        }else{
            throw Error('Authorization token is missing!');  
        }
        
    } catch(err){
        throw err.message;     
        // console.log(`error is : ${err}`);
        // return false;
    }
    
}

module.exports = router;