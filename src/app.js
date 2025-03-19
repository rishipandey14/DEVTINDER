const express = require("express");
const connectDB = require('./config/database');
const User = require('./models/user')
const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Rishi",
        lastName: "Pandey",
        emailId: "hopesalive1403@gmail.com",
        password: "ibgiwjbg",
        age: 21,
        gender: "M"
    });

    try {
        await user.save();
        console.log("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error saving the user : " + err.message);
    }
})


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