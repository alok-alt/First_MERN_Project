var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

const {signout, signup, signin,isSignedIn} = require("../controllers/auth.js");

router.post("/signup",[
    body("name").isLength({ min: 3}).withMessage("must be at least 3 char long"),
    body("email").isEmail().withMessage("Enter a Valid Email"),
    body("password").isLength({min: 3}).withMessage("Password must min 3 char")
],signup);

router.post("/signin",[
    body("email").isEmail().withMessage("Enter a Valid Email"),
    body("password").isLength({min: 1}).withMessage("Password is required"),
],signin);



router.get("/signout", signout);


router.get("/testroute",isSignedIn, (req,res) => {
    res.send("A protected route");
});

module.exports = router;