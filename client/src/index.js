const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const bodyParser = require('body-parser');
const alert = require('alert');
const { Script } = require('vm');
const axios = require('axios');

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

app.get("/after-login", (req, res) => {
    res.render("after-login");
});

app.get("/login", (req, res) => {
    res.render("login-page");
});

app.get("/signup", (req, res) => {
    res.render("signup-page");
});


// Serve the index.html file from the templates directory
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../../server/templates', 'index.html'));
});



// Rendering the server of the Gesture Recognition

app.get('/fetch-data', async (req, res) => {
    try {
        res.send('<script>window.location.href = "http://192.168.0.115:5000"</script>');
    } catch (error) {
        console.error('Error fetching data from Flask:', error);
        res.status(500).send('Error fetching data');
    }
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
        res.send('<script>alert("User already exists! Please login"); window.location.href = "/login"</script>');
    }
    else {

        // Hash the password using bcrypt

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashPassword; //Replace the original password with hashed password

        const userdata = await collection.insertMany(data);
        res.send('<script>alert("Registration successful!"); window.location.href = "/after-login"</script>');
    }
});



// Login User

app.post("/login", async (req, res) => {
    try {

        // Finding the email entered from the database

        const check = await collection.findOne({email: req.body.email});

        // Comparing the hashed password from database with the entered password

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if(isPasswordMatch) {
            res.send('<script>alert("Login successful!"); window.location.href = "/after-login"</script>');
        }
        else {
            res.send('<script>alert("Check your password and try again!"); window.location.href = "/login"</script>');
        }
    }
    catch {
        res.send('<script>alert("User not found! Please register"); window.location.href = "/signup"</script>');
    }
});






// Localhost port connection

const port = 8000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});