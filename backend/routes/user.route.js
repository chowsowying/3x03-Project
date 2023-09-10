const express = require("express");
const router = express.Router();
// Middlewares
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
// Controllers
const { listAllUsers } = require("../controllers/auth.controller");
const User = require("../models/user.model");


// Get a list of all users
router.route('/').get(function (req, res) {
    User.find(function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(user);
        }
    });
});

router.get("/all-users", isAuth, isAdmin, listAllUsers);

module.exports = router;