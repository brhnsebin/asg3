const express = require("express");
const router = express.Router();

const authCntrl = require("../controllers/auth");

router.get("/login", authCntrl.getLogin);
router.get("/signup", authCntrl.getSignup);
router.post("/login", authCntrl.postLogin);
router.post("/signup", authCntrl.postSignup);
router.post("/logout", authCntrl.postLogout);

module.exports = router;