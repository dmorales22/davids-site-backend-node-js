const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./index");
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
  "?retryWrites=true&w=majority";
*/
const DB = "mongodb://127.0.0.1/testbackend"; //Comment this line if you're not using local server

// Connect to MONGODB server.
mongoose.connect(
  DB,
  {
    useNewURLParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Database connection successful!");
  }
);

const port = process.env.PORT;

// COMMENT FOR DEPLOYMENT ONLY. ENABLES SSL BUT REQUIRES ADMIN/ROOT PRIVILEGES
if (process.env.DEPLOYMENT === "0") {
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });
}

// Close database connection when the app is terminated.
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});
