const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes/routes");
const cors = require("cors");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

//parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
//routes
app.use(routes);

//custom error handler

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  //ensures we don't send two headers in one response
  console.log(err);
  const message = err.message || "an unknown server error occurred";
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ message: message });
});

mongoose
  .connect(process.env.CONNECTION_URL || "mongodb://localhost:27017/NBADB")
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("listening 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
