const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('http-auth');
const bcrypt = require('bcrypt'); // <--- Add this line

const router = express.Router();
const Registration = mongoose.model('Registration');

// HTTP Basic Auth configuration
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

// GET: Homepage
router.get('/', (req, res) => {
  res.render('index', { title: 'Simple Kitchen' });
});

// GET: Registration form
router.get('/form', (req, res) => {
  res.render('form', { title: 'Register', errors: [], data: {} });
});

// GET: Thank You page after successful submission
router.get('/thankyou', (req, res) => {
  res.render('thankyou', { title: 'Thank You!' });
});

// POST: Submit registration form (now with username/password & bcrypt)
router.post(
  '/form',
  [
    check('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('username')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter a username'),
    check('password')
      .isLength({ min: 4 })
      .withMessage('Password must be at least 4 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { name, email, username, password } = req.body;

    if (!errors.isEmpty()) {
      // Return entered fields so user doesn't need to retype everything
      return res.render('form', {
        title: 'Register',
        errors: errors.array(),
        data: { name, email, username },
      });
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const registration = new Registration({
        name,
        email,
        username,
        password: hashedPassword,
      });

      await registration.save();
      res.redirect('/thankyou');
    } catch (err) {
      console.error('Database error:', err);
      res.send('Sorry! Something went wrong.');
    }
  }
);

// GET: Protected list of registrations
router.get('/registrations', basic.check(async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.render('index', {
      title: 'Listing registrations',
      registrations,
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.send('Sorry! Something went wrong.');
  }
}));

module.exports = router;
