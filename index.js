const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import routes from auth.js

const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts')

dotenv.config();

//connect to database 

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connected to database'));


//middleweare to parse all the data going to database 

app.use(express.json({ extended: false }));


//Route middleweares to direct routes data

app.use('/api/user', authRouter);
app.use('/api/posts', postRouter);



app.listen(3000, () => console.log('Server running'));