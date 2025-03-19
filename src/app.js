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

app.get("/getUserData", (req, res) =>{
    // throw new error("egdg");
    // res.send("User data send");

    // or better use try catch
    try {
        throw new error("egdg");
        res.send("User data send");
    } catch (error) {
        res.status(500).send("Some error occured, Kindly contact Support Team");
    }
})


// error handling
app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong");
    }
})

app.listen(3000, () => {
    console.log("Hello from the server");
});