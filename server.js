const express= require('express');
// const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const userRoutes = require('./routes/userRoutes')
const authentication = require('./routes/authentication');
const port=8000;
const app= express();

app.use(bodyParser.json());
app.use('/auth', authentication);
app.use('/users',userRoutes);

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})
