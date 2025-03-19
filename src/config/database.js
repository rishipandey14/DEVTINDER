const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rishi:714xwVg314yGNKUh@learningmongo.f8uta.mongodb.net/DevTinder");
};

module.exports = connectDB;
