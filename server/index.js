require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;
const authCtrl = require("./controllers/authController");
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const app = express();
app.use(express.json());
massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
});
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addMyTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port ${SERVER_PORT}`);
});
