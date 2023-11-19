const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./index");
dotenv.config({ path: "./.env" });
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
