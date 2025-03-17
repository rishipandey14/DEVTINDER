const express = require("express");

const app = express();

app.use("/user", 
    (req, res, next) => {
        console.log("First route handler");
        // res.send("Response 1");
        next();
    },
    (req, res, next) => {
        console.log("Second route Handler");
        // res.send("Response 2");
        next();
    },
    (req, res, next) => {
        console.log("Second route Handler");
        res.send("Response 3");
    },
    (req, res, next) => {
        console.log("Second route Handler");
        res.send("Response 4");
    },
    (req, res, next) => {
        console.log("Second route Handler");
        res.send("Response 5");
    }
)

app.listen(3000, () => {
    console.log("Hello from the server");
});