require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const products = require("./routes/products.router");
const users = require("./routes/users.router");
const carts = require("./routes/carts.router");
const wishlists = require("./routes/wishlists.router");
const initializeDbConnection = require("./db/db.connect");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 3000;

initializeDbConnection();

app.use("/products", products);
app.use("/users", users);
app.use("/carts", carts);
app.use("/wishlists", wishlists);

app.get("/", (req, res) => {
  res.send("Welcome to Circlekart");
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
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: "error occurred, see the error message for more details",
    errorMessage: err.Message,
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`server is running at port ${port}`);
});
