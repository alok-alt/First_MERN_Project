const User = require("../models/user.js");
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signup = (req, res) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()
        })
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            console.log(err);
            return res.status(400).json({
                err: "NOT ABLE TO  save user in DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
    

};

exports.signin = (req, res) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()
        })
    }
    const {email, password} = req.body;

    User.findOne({email}, (err, user) => {
        if(err || !user){
            console.log(err);//op- null
            return res.status(400).json({
                error: "USER email doesn't exist"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Incorrect password"
            })
        }
        //create token
       const token = jwt.sign({_id: user._id}, process.env.SECRET);
       //put token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        //send response to front end
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});
    } );

}


exports.signout = (req,res) =>{
    res.clearCookie("token");
    res.json({
        user: "Use signout sucessfully"
    });
}


//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not ADMIN, Access denied"
        })
    }
    next();
}