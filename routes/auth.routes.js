const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const User = require('../models/User');

const router = Router();
const t = require('../i18n/en');

// api/auth/register
router.post(
  '/register',
  [check('email', t.auth.incorrectEmail).isEmail(), check('password', t.auth.passwordLength).isLength({ min: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: t.auth.incorrectData,
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: t.auth.userExist });
      }

      const hashedPassword = bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: t.auth.created });
    } catch (e) {
      res.status(500).json({ message: t.errors.server });
    }
  }
);

// api/auth/login
router.post(
  '/login',
  [
    check('email', t.auth.incorrectEmail).normalizeEmail().isEmail(),
    check('password', t.auth.passwordLength).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: t.auth.incorrectLoginData,
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: t.auth.noUser });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: t.auth.incorrectEmailOrPassword });
      }
        const token = jwt.sign(
          { userId: user.id,},
          config.get('jwtSecret'),
          {expiresIn: '1h'}
        );
        res.json({token, userId: user.id});
      }
    } catch (e) {
      res.status(500).json({ message: t.errors.server });
    }
  }
);

module.exports = router;
