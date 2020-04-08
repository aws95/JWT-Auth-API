const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { regsitrationValidation, loginValidation } = require('../validation');


//async to give time to submit to the database

router.post('/register', async (req, res) => {

    //validation for data

    let { error } = regsitrationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user email in database 

    let emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists! Try with a different email please.');

    //hash password 

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    //save data to database 

    try {
        let savedUser = await user;
        savedUser.save();
        res.send({ user: user._id });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

//login post request 

router.post('/login', async (req, res) => {

    //validation for data

    let { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user email exists in database 

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email id not found');

    //password is correct

    let validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password'); 

    //create and assign token 

    let token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
});


module.exports = router;