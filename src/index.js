const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const bodyParser = require('body-parser');

const app = express();

// Convert data to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engineS
app.set('view engine', 'ejs');


// Static files
app.use('/public', express.static("public"));
app.use('/assets', express.static("assets"));
app.use('/scripts', express.static("scripts"));


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/", (req, res) => {
    res.render("after-login");
});

app.get("/login", (req, res) => {
    res.render("login-page");
});

app.get("/signup", (req, res) => {
    res.render("signup-page");
});



// Register User

app.post("/signup", async (req, res) => {

    const data = {
        email: req.body.email,
        password: req.body.password
    }


    // Check whether the user is exiting or not

    const existingUser = await collection.findOne({ email: data.email });

    if (existingUser) {
        res.send("User already exists. Choose a different username!");
    }
    else {

        // Hash the password using bcrypt

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashPassword; //Replace the original password with hashed password

        const userdata = await collection.insertMany(data);
        res.render("after-login");
    }
});



// Login User

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({email: req.body.email});
        if(!check) {
            res("Username cannot be found!");
        }

        // Comparing the hashed password from database with the entered password

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if(isPasswordMatch) {
            res.render("after-login");
        }
        else {
            req.send("Check your password and try again!");
        }
    }
    catch {
        req.send(alert("Check your credentials!"));
    }
})






// Localhost port connection

const port = 8000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});