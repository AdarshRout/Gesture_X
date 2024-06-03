const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

// Use EJS as the view engine

app.set('view engine', 'ejs');

 app.get("/", (req, res) => {
    res.render("login-page");
 });

 app.get("/singup", (req, res) => {
    res.render("signup-page");
 });


 const port = 8000;
 app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
 });