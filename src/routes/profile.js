const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");


// view Profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// edit profile API
profileRouter.put("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) throw new Error("Invalid edit request");

        const loggedInUser = req.user;
        // Set all the fields in the user model to the values provided in the request
        loggedInUser.firstName = req.body.firstName || loggedInUser.firstName;
        loggedInUser.lastName = req.body.lastName || loggedInUser.lastName;
        loggedInUser.age = req.body.age || loggedInUser.age;
        loggedInUser.gender = req.body.gender || loggedInUser.gender;
        loggedInUser.about = req.body.about || loggedInUser.about;
        loggedInUser.photoUrl = req.body.photoUrl || loggedInUser.photoUrl;
        loggedInUser.skills = req.body.skills || loggedInUser.skills; // Overwrite skills entirely

        await loggedInUser.save()
        res.json({
            message : `${loggedInUser.firstName} , your profile updated successfully`,
            data : loggedInUser,
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// password change API
profileRouter.patch("/profile/password/change", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {existingPassword, newPassword} = req.body;

        const isExistingPasswordValid = await loggedInUser.validatePassword(existingPassword);
        if(!isExistingPasswordValid) {
            return res.status(400).json({error : "Incorrect existing password"})
        }

        // Check if the new password is strong
        if (!validator.isStrongPassword(newPassword, { minLength: 8, minNumbers: 1, minSymbols: 1, minUppercase: 1, minLowercase: 1 })) {
            return res.status(400).json({ error: "Weak password. Use at least 8 characters with uppercase, lowercase, number, and special character." });
        }

        loggedInUser.password = await bcrypt.hash(newPassword, 10);
        await loggedInUser.save();

        res.json({
            message : "Password changed successfully",
        });

    } catch (err) {
        res.status(500).json({error : err.message});
    }
})




module.exports = profileRouter;