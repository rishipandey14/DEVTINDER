const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("Test successfully runed");
})

app.listen(3000, () => {
    console.log("Hello from the server");
})