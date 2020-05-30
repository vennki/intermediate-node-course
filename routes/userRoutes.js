const express = require('express');
const router = express.Router();
const User = require('../models/User')

// CREATE
router.post('/', (req, res) => {
    // User.create()
    User.create(
        {...req.body.newData},
        (err, data) =>{
        sendResponse(res,err,data);
        }
    );
})


router.route('/:id')
// READ
.get((req,res)=>{
  // User.findById()
  User.findById(req.params.id,(err, data) =>{
    sendResponse(res,err,data);
  });
})
// UPDATE
.put((req,res)=>{
  // User.findByIdAndUpdate()
  User.findByIdAndUpdate(req.params.id, 
    {...req.body.newData},
    {
      new: true
    },
    (err, data) => {
      sendResponse(res,err,data);
    }
    )
})
// DELETE
.delete((req,res)=>{
  // User.findByIdAndDelete()
  User.findByIdAndDelete(req.params.id, (err, data) => {
    sendResponse(res,err,data);
  })
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

module.exports = router;