const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*******************
 * User signup
 ********************/
router.post("/register", (req, res) => {
    const userFromRequest = {
      username: req.body.username,
      passwordhash: bcrypt.hashSync(req.body.password, 10),
    };
    User.create(userFromRequest)
      .then((user) => {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({
          user: user,
          message: "User successfully created!",
          sessionToken: token,
        });
      })
      .catch((err) => res.status(500).json({ error: err }));
  });

  /*******************
 * User signin
 ********************/
router.post("/login", (req, res) => {
    User.findOne({ where: { username: req.body.username } }).then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.passwordhash, (err, matches) => {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.status(200).json({
              user: user,
              message: "user signed in",
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: "Incorrect password" });
          }
        });
      } else {
        res.status(500).send({ error: "User does not exist." });
      }
    },
    err => res.status(501).send({ error: 'failed to process' })
    );
  });

module.exports = router;