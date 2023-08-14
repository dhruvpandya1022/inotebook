const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "harryisagood$oy";
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// Route 1: Create User
router.post('/createuser', [
    body('name', 'Enter Valid Name').isLength({min: 3}),
    body('email', 'Enter Valid Email').isEmail(),
    body('password').isLength({min: 8}),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        let user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(400).json({error: "Sorry a user with this email id already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash( req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        res.json({authtoken})

        // }).then(user => res.json(user))
        // .catch(err => {console.log(err)
        // res.json({error: 'Please enter a unique value'})});
    }
    catch(error) {
        console.log(error.message);
        res.status(500).send("Some Error Occured");
    }
})

// Router 2: Login
router.post('/login', [
    body('email', 'Enter Valid Email').isEmail(),
    body('password', "Password can't be empty").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let success = false;
    const email = req.body.email;
    const password = req.body.password;
    try{
        let user = await User.findOne({email});
        if(!user) {
            success = false;
            return res.status(400).json({success, error: "Try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            success = false;
            return res.status(400).json({success, error: "Try to login with correct credentials"});
        }
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authtoken})
    } 
    catch(error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
});

// Route 3: Get loggedin user details
router.post('/getuser', fetchuser, async (req, res) => {
    try{
        userId= req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch(error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
});
module.exports = router