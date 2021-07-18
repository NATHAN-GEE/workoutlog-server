const router = require("express").Router();
const { UserModel } = require("../models");
const User = require("../models/user");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let validateJWT = require("../middleware/validate");

router.get("/", (req, res) => {
  res.send(`nathan it worked`);
});

router.get("/register", validateJWT,  async (req, res) => {
  let { username, passwordHash } = req.body.user;
  try {
    let User = await UserModel.create({
      username,
      passwordHash: bcrypt.hashSync(passwordHash, 13),
    });
    let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    res.status(201).json({
      message: `user created successfully`,
      user: User,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "email already in use",
      });
    } else {
      res.status(500).json({
        message: "Failed to register user.",
      });
    }
  }
});

router.post("/login", validateJWT, async (req, res) => {
  let { username, passwordHash } = req.body.user;
  try {
    let userLogin = await UserModel.findOne({
      where: {
        username: username,
      },
    });
    if (userLogin) {
      let passwordCompare = await bcrypt.compare(passwordHash, userLogin.passwordHash);
      if (passwordCompare) {
        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });
        res.status(200).json({
          user: userLogin,
          message: `you are logged in.`,
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect email or password.",
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect email or password.",
      });
    }
  } catch (err) {
    res.status(500);
    message: "Not allowed Nathan";
  }
});

module.exports = router;
