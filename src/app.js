require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const User = require("./models/User");
const passport = require("passport");
const port = process.env.PORT || 3000;

const publicDirectory = path.join(__dirname, "../public");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.static(publicDirectory));
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/", userRouter);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
