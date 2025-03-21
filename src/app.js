const express = require("express");
const connectDB = require('./config/database');
const User = require('./models/user')
const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();

        console.log("User Added Successfully")
        
        res.status(201).send({message: "User added successfully", user});
    } catch (err) {
        res.status(400).send("Error saving the user : " + err.message);
    }
});

// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.find({emailId: userEmail});

        if(user.length === 0){
            res.status(400).send("user not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});

// Feed API - GET /feed - get all the users from the database



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