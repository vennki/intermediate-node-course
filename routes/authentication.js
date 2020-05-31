const app = require('express');
const router = app.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = '../../ssh/venkat_private_key';

router.post('/', async (req, res) => {
    try{
        let token = await authenticate(req.body.authenticate);
        res.json({
            authentication : {
                success: true,
                token: token,
                expiresIn: '3600 seconds'
            }
        })
    } catch(err) {
        res.json({
            authentication : {
                success: false,
                message: err
            }
        });     
    }
});

async function authenticate(auth){
    let userDetails = await User.findOne({email: auth.email});
    if(await verifyUser(userDetails, auth.password)){
        let secret = fs.readFileSync(privateKey);
        // console.log(`secret is : ${secret}`);
        return jwt.sign(auth, secret,{algorithm: 'RS256', expiresIn: 60*60});
    }
}

async function verifyUser(userDetails, userPassword){
    // console.log(userDetails);
    // console.log(userPassword);
    let isSuccess =  await bcrypt.compare(userPassword, userDetails.password);
    // console.log(`User is ${isSuccess}`);
    return isSuccess;
}

module.exports = router;