require("dotenv").config();
const express = require("express");
const router = require("./routes");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");
const path = require("path");

app.use(router);
app.use(cors());

const dbURL = process.env.DB;

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.log("No connection :(", err));

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`listening to port ${port}`));
