const express = require("express");
const router = express.Router();

const {getUserById, getUser, getAllUser, updateUser, userPurchaseList} = require("../controllers/user.js");
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth.js");

router.param("userId", getUserById);

router.get("/user/:userId",isSignedIn ,isAuthenticated ,getUser);

router.put("/user/:userId",isSignedIn ,isAuthenticated ,updateUser);

router.get("/order/user/:userId",isSignedIn ,isAuthenticated, userPurchaseList);
//assingment
// router.get("/user", getAllUser);

module.exports = router;
