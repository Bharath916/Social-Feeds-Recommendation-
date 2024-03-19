import * as loginController from "../../controllers/auth/login";
import express from "express";
import passport from "passport";
const requireLogin = passport.authenticate("local", { session: false });
const googleLogin = passport.authenticate("google", {
  scope: ["openid", "email"],
});

const router = express.Router();

router.post("/log-in", loginController.logIn);
// router.get("/logout", loginController.logout);

module.exports = router;
