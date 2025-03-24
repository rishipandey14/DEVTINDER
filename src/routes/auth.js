const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).send({ message: "User added successfully", user });
    } catch (err) {
        res.status(400).send("Error saving the user : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            // create a JWT token
            const token = await user.getJWT();

            // Add the token to cookie and send response back to the user
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send("Login Successfully");
        }
        else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { 
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfully");
});


module.exports = authRouter;