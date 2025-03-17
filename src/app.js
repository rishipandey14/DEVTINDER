const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({FirstName : "Rishi", LastName : "Pandey"});
});

app.post("/user", (req, res) => {
    // saving data to db
    res.send("Saved user's data successfully");
});

app.delete("/user", (req, res) => {
    // delete user
    res.send("Delted user successfully");
});


app.use("/test", (req, res) => {
    res.send("Test successfully runed");
});

app.listen(3000, () => {
    console.log("Hello from the server");
});