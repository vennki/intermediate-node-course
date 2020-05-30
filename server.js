const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const userRoutes = require('./routes/userRoutes')
const port=8000;
const app= express();


mongoose.connect('mongodb://localhost/userData');

app.use(bodyParser.json());
app.use('/users',userRoutes);

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})
