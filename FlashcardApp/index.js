const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const systemConfig = require("./config/system.js");
require("dotenv").config();

//Add route
const clientRoute = require("./routes/client/index.routes");

//Database Connect
const database = require("./config/database.js")
database.connect();

const app = express();
const port = process.env.PORT;

//Set view and public folder
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug'); // which template engine
app.use(express.static(`${__dirname}/public`));

//App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Body parser config parse x-www-form-urlencoded
app.use(bodyParser.urlencoded());
//Parse application/json
app.use(express.json());


//Config Cookie-parse
app.use(cookieParser(process.env.COOKIE_SECRET));

//Method override
app.use(methodOverride("_method"));



clientRoute(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
