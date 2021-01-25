const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { passportAuth } = require("../middleware/passportcookieHelper");
const { googleAuth } = require("../middleware/googleAuth");

router.get("/", (req, res) => {
    res.render("index");
});

// router.get("/auth/google", (req, res)=>{
//     passport.authenticate('google', { scope: ["profile"] })
// })

router.get('/auth/google',
    passportAuth, googleAuth, 
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/secrets',passportAuth, 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
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

// router.get("/secrets", (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render("secrets");
//     } else {
//         res.redirect("/login");
//     }
// });

router.get("/secrets", (req, res)=>{
    User.find({"secret": {$ne: null}}, (err, foundUsers)=>{
      if (err){
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("secrets", {usersWithSecrets: foundUsers});
        }
      }
    });
  });

router.post("/register", passportAuth, (req, res) => {
    const username = req.body.username;
        const password = req.body.password;
 
        User.register({ username: username, email: username, provider: 'local' }, password, function(err, user) {
          if (err) {
            console.log(err);
            res.redirect('/register');
          } else {
            passport.authenticate('local')(req, res, function() {
              res.redirect('/secrets');
            })
          }
        }
        )
    });

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  
router.get('/submit', (req, res)=>{
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login")
    }
})

// router.post("/submit", function(req, res){
//     const submittedSecret = req.body.secret;
  
//   //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
//     // console.log(req.user.id);
//   console.log(submittedSecret)
//     User.findById(req.user.id, function(err, foundUser){
//       if (err) {
//         console.log(err);
//       } else {
//         if (foundUser) {
//           foundUser.secret = submittedSecret;
//           foundUser.save(function(){
//             res.redirect("/secrets");
//           });
//         }
//       }
//     });
// });


module.exports = router;
