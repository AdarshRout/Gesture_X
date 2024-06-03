const mongoose = require('mongoose');

const connect = mongoose.connect("mongodb://localhost:27017/GestureX");



// Check whether the database is connected or not

connect.then(() => {
    console.log("Database connected successfully!");
})
.catch(() => {
    console.log("Database cannot be connected!");
})



// Create a Schema

const Loginschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


// Collecting data

const collection = new mongoose.model("users", Loginschema);

module.exports = collection;