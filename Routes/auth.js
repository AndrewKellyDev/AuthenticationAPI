const router = require('express').Router();
const User = require('../Model/User');
const { registerValidation , loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {

    //Validate Body With Joi Schema
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send({description: error.details[0].message});

    //Check If Email Exists
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send({description: "Email Already Exists."});

    //Hash Passwords

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password ,salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashpassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});

//Login

router.post('/login' , async (req,res) =>{
    //Validate Body With Joi Schema
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send({description: error.details[0].message});
        //Check If Email Exists
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send({description: "Email Or Password Is Incorrect."});

        //Check Password
        const validPass  = await bcrypt.compare(req.body.password , user.password);
        if(!validPass) return res.status(400).send({description: "Email Or Password Is Incorrect."});

        res.send({description: "Logged In Successfully"})

});

module.exports = router;