const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = req.body;

        // Validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Match 2 password
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword value does not match, please try again."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});

        // If user already exists then return response
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        console.log("user: ", user)

        // return response successful
        return res.status(200).json({
            success: true,
            user,
            message: "User is registered successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again."
        });        
    }
}

// login
exports.login = async (req, res) => {
    try {
        // Ftech data from req ki body
        const {email, password} = req.body;

        // Validate data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required. Please try again."
            });
        }

        // Check if user already exists or not
        const user = await User.findOne({email});

        // If user is not exists then return response
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered. please signup up"
            });
        }

        // Generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                eamil: user.email,
                id: user._id,
                accountType: user.accountType
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h"
            });

            user.token = token;
            user.password = undefined; // For security purpose

            // Create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            };

            await User.findOneAndUpdate(
                {email: email},
                {
                    token: token
                },
                {new: true}
            );

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in successfully."
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect."
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
}
