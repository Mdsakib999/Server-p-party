import { Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Roles } from "../../utils/roles.js";
import { envVariables } from "../../config/envVariables.js";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Roles),
  AuthControllers.changePassword
);
router.post("/set-password", checkAuth(...Roles), AuthControllers.setPassword);
router.post("/forgot-password", AuthControllers.forgotPassword);

router.get("/google", async (req, res, next) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVariables.CLIENT_URL}/login?error=There is some issues with your account. Please contact with out support team!`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
