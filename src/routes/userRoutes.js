const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { passportAuth } = require("../middleware/passportcookieHelper");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passportAuth, (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    req.login(user, (err) => {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

router.post("/register", passportAuth, (req, res) => {
    User.register(
        { username: req.body.username },
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("secrets");
                });
            }
        }
    );
});

module.exports = router;
