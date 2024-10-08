const express = require("express");
const passport = require("./config/passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { pool } = require("./config/database");
const { createUserTable } = require("./models/user");
const { createMessageTable } = require("./models/message");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const messageRoutes = require("./routes/message");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
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

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

createUserTable();
createMessageTable();

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
