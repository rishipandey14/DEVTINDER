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