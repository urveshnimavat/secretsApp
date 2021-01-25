const mongoose = require("mongoose");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
require("../db/conn");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email Address!");
            }
        },
    },
    password: {
        type: String,
    },
    googleId : {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField:"username"});
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;
