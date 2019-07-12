require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authController = require('./controllers/authController')
const treasureController = require('./controllers/treasureController')
const authMiddleware = require('./middleware/authMiddleware')

const app = express();

const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env;

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('Database online')
})

app.use( session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
}))

app.post('/auth/register', authController.register)
app.post('/auth/login', authController.login)
app.get('/auth/logout', authController.logout)
app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', authMiddleware.usersOnly, treasureController.getUserTreasure)
app.post('/api/treasure/user', authMiddleware.usersOnly ,treasureController.addMyTreasure)
app.get('/api/treasure/all', authMiddleware.usersOnly, authMiddleware.adminsOnly ,treasureController.getAllTreasure)


app.listen(SERVER_PORT, () => {
  console.log(`Server spinning up on port ${SERVER_PORT}`);
});
