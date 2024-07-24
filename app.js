const express = require("express");
const passport = require("./config/passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./config/database");
const { createUserTable } = require("./models/users");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "user-sessions",
      createTableIfMissing: true,
    }),
    secret: "apple",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.session());

// app.use("/", indexRoutes);
app.use("/auth", authRoutes);

createUserTable();

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
