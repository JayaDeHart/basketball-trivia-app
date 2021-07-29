const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const verfiyJWT = require("../middlewares/verifyJWT");

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.post("/sendAnswer", verfiyJWT.verfiyJWT, controller.sendAnswers);

module.exports = router;
