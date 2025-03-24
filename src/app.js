const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const connectDB = require('./config/database');
const User = require('./models/user')
const { validateSignupData } = require("./utils/validation")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");







// get user Profile API


// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.find({ emailId: userEmail });

        if (user.length === 0) {
            res.status(400).send("user not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", userAuth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong")
    }
});


// delete user by id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    } catch (err) {
        res.status(400).send("something went wrong")
    }
});


// update data of the user using unserId
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ]

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills can not be more than 10")
        }

        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true });

        res.send({ message: "user updated successfully", user });
    } catch (err) {
        res.status(400).send("update failed: " + err.message)
    }
});


// update data of the user using emailId
app.patch("/user", async (req, res) => {
    const emailId = req.body.emailId;
    const data = req.body;

    try {
        const user = await User.findOneAndUpdate({ emailId: emailId }, data, { new: true });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        } else {
            res.send({ message: "user updated successfully", user });
        }
    } catch (err) {
        res.status(400).send("something went wrong")
    }
});



connectDB()
    .then(() => {
        console.log("Database connection extablished successfully");
        app.listen(3000, () => {
            console.log("Hello from the server");
        });
    })
    .catch((err) => {
        console.log("Database cannot be connected");
    });