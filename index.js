const express = require("express");
const compression = require("compression");
const session = require("express-session");
const app = express();
const bodyparser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const multer = require("multer");
const upload = multer({ limits: { fieldSize: 25 * 1024 * 1024 } });
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
/* Uncomment to enable auth creds to DB
const DB =
  "mongodb+srv://" +
  process.env.MONGODB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@" +
  process.env.MONGODB_SERVER +
  "/" +
  process.env.MONGODB_NAME +
  "?retryWrites=true&w=majority"; //Creates URL string to access the MongoDB server

 */
const DB = "mongodb://127.0.0.1/testbackend"; //Comment this line if you're not using local server
const contactRoute = require("./routes/contactRoute");
const agentRoute = require("./routes/agentRoute");
const signInRoute = require("./routes/signInRoute");

const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser());
app.use(compression()); //Enables text compression
//app.set('trust proxy', true)

if (process.env.DEPLOYMENT === "1") {
  //Creates secure session if deployment option is enabled. Only use this when you have SSL setup
  console.log("Starting deployment mode.");
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      secure: true,
      saveUninitialized: true,
      store: new MongoStore({
        mongoUrl: DB,
        dbName: process.env.MONGODB_NAME,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: "native",
      }),
      cookie: {
        maxAge: oneDay,
        httpOnly: false,
        secure: true,
      },
    })
  );
} else {
  //Non-deployment version meant for testing.
  console.log("Starting development mode.");
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,

      saveUninitialized: true,
      store: new MongoStore({
        mongoUrl: DB,
        dbName: process.env.MONGODB_NAME,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: "native",
      }),
      cookie: {
        maxAge: oneDay,
        httpOnly: true,
        secure: false,
      },
    })
  );
}

app.use(
  cors({
    //Checks if request are coming from a specific origin
    origin: process.env.CORSURL, //Replace URL upon deployment
    methods: [
      "POST",
      "PUT",
      "GET",
      "OPTIONS",
      "HEAD",
      "DELETE",
      "UPDATE",
      "PATCH",
    ],
    credentials: true,
  })
);

//For parsing JSON data from the POST requests
app.use(bodyparser.json({ limit: "512mb" }));

//For urlencoded and form data
app.use(bodyparser.urlencoded());
app.use(bodyparser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.any());
app.use(express.static("public"));

//Non-protected routes. Should be use for public/unauthenticated routes
app.use(signInRoute);

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(rateLimiter);
//app.use("", openRoute);
app.use(auth); //Applies middleware to the routes below.

//Protected routes that require a token to access them. See middleware/auth.js for more details
app.use("/api", agentRoute);
app.use("/api", contactRoute);

app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

// ENABLES SSL BUT REQUIRES ADMIN/ROOT PRIVILEGES. ONLY USE FOR DEPLOYMENT PURPOSES
if (process.env.DEPLOYMENT === "1") {
  https
    .createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
        ca: fs.readFileSync(process.env.SSL_CA),
      },
      app
    )
    .listen(5000, () => {
      console.log("Listening...");
    });
}

module.exports = app;
