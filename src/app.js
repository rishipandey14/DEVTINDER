const express = require("express");

const app = express();

// Handle Auth middleware 

const {adminAuth, userAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth)

app.get("/admin/data", (req, res) => {
    res.send({FirstName : "Rishi", LastName : "Pandey"});
});

app.post("/admin/data", (req, res) => {
    // saving data to db
    res.send("Saved user's data successfully");
});

app.delete("/admin/data", (req, res) => {
    // delete user
    res.send("Deleted user successfully");
});


app.get("/user", userAuth, (req, res) => {
    res.send("User data fetched");
});

app.post("/user", userAuth, (req, res) => {
    res.send("User data posted successfully");
});

app.listen(3000, () => {
    console.log("Hello from the server");
});