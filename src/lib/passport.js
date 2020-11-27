const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("./helpers");
const userModel = require("../models/user.model");
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const email = req.body.email;
      const newUser = {
        username,
        email,
        password,
      };
      newUser.password = await helpers.encryptPassword(password);
      // Saving in the Database
      const result = await userModel.add(newUser);
      newUser.id = result.insertId;
      return done(null, newUser);
    }
  )
);
passport.use(
  "local.login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const rows = await userModel.allWhere("username", username);
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(null, user, req.flash("success", "Welcome " + user.username));
        } else {
          done(null, false, req.flash("error", "Mật khẩu không đúng"));
        }
      } else {
        return done(
          null,
          false,
          req.flash("error", "Tên đăng nhập không tồn tại")
        );
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const rows = await userModel.allWhere("id", id);
  done(null, rows[0]);
});
