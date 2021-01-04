/* Variables*/
const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');

//Import Routes
const authRoute = require('./Routes/auth');

dotenv.config();

//Connect To DB
mongoose.connect( process.env.DB_CONNECT,
{useNewUrlParser: true, useUnifiedTopology: true},
() => console.log('Connected To The Database'));

//Middleware

app.use(express.json());

//Route Middleware
app.use('/api/user' , authRoute)

/* Starts Server On Port 3000*/
app.listen(3000 , () => console.log('Auth Server Up'));