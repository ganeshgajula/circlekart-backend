const express = require("express");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the world of backend with express!!");
});

/**
 * Error Handler
 * Note: Do not move.
 */
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "error occurred, see the error message for more details",
    errMessage: err.Message,
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
