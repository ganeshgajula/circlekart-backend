const express = require("express");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the world of backend with express!!");
});

/**
 * 404 Route Handler
 * Note: Do not move. This should be the last route.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server, please check.",
  });
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
