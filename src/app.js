const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require('./config/database');
const User = require('./models/user')
const { validateSignupData } = require("./utils/validation")
const app = express();

app.use(express.json())

// add user in the database / signup
app.post("/signup", async (req, res) => {

    try {
        // validation of data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);


        // create new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });

        await user.save();

        console.log("User Added Successfully")

        res.status(201).send({ message: "User added successfully", user });
    } catch (err) {
        res.status(400).send("Error saving the user : " + err.message);
    }
});

// login API
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(isPasswordValid){
            res.send("Login Successfully");
        }
        else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

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
app.get("/feed", async (req, res) => {
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