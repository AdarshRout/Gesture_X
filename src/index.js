const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

// Use EJS as the view engineS
app.set('view engine', 'ejs');


// Static files
app.use('/public', express.static("public"));
app.use('/assets', express.static("assets"));
app.use('/scripts', express.static("scripts"));


app.get("/", (req, res) => {
    res.render("home");
});

 app.get("/login", (req, res) => {
    res.render("login-page");
 });

 app.get("/signup", (req, res) => {
    res.render("signup-page");
 });


 const port = 8000;
 app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
 });