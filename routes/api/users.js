const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route   POST api/users
//@desc    Register route
//@access  Public
router.post('/', [
  check('name', 'Name is required')
  .not()
  .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 6 })
], 
async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array() })
  }

  const { name, email, password } = req.body;

  try{
     //check if the use exist
     let user = await User.findOne({ email });

     if (user) {
       res.status(400).json({ errors: [{ msg: 'User already exists' }] });
     }

    //Get user's gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    user = new User({
      name,
      email,
      avatar,
      password
    })

    //Encrypt the password using bcrypt
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //Return jsonwebtoken

    return res.send('User registered')
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }

});

module.exports = router;