import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../modules/user/user.model.js";
import { envVariables } from "./envVariables.js";
import { OTPService } from "../modules/otp/otp.service.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done("User does not exist");
        }

        if (!isUserExist.isVerified) {
          await OTPService.sendOTP(isUserExist?.email, isUserExist?.name);
          return done("User is not verified");
        }

        if (isUserExist.isDeleted) {
          return done("User is deleted");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(
          password,
          isUserExist.password
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Invalid Credentials" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVariables.GOOGLE_CLIENT_ID,
      clientSecret: envVariables.GOOGLE_CLIENT_SECRET,
      callbackURL: envVariables.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await User.findOne({ email });

        if (user && !user.isVerified) {
          await OTPService.sendOTP(user.email, user.name);
          return done(null, false, { message: "User is not verified" });
        }

        if (user && user.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        if (user) {
          const hasGoogleAuth = user.auths?.some(
            (auth) => auth.provider === "google"
          );

          if (!hasGoogleAuth) {
            user.auths.push({
              provider: "google",
              providerId: profile.id,
            });
            await user.save();
          }

          return done(null, user);
        }

        user = await User.create({
          email,
          name: profile.displayName,
          photos:
            profile.photos?.map((p) => ({
              url: p.value,
              public_id: null,
            })) || [],
          role: "USER",
          isVerified: true,
          auths: [
            {
              provider: "google",
              providerId: profile.id,
            },
          ],
        });

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
