require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const products = require("./routes/products.router");
const users = require("./routes/users.router");
const carts = require("./routes/carts.router");
const wishlists = require("./routes/wishlists.router");
const initializeDbConnection = require("./db/db.connect");
const { routeHandler } = require("./middlewares/routeHandler");
const { errorHandler } = require("./middlewares/errorHandler");
const { authVerify } = require("./middlewares/authVerify");

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

initializeDbConnection();

app.use("/products", products);
app.use("/users", users);
app.use("/carts", authVerify, carts);
app.use("/wishlists", authVerify, wishlists);

app.get("/", (req, res) => {
  res.send("Welcome to Circlekart");
});

/**
 * 404 Route Handler
 * Note: Do not move. This should be the last route.
 */
app.use(routeHandler);

/**
 * Error Handler
 * Note: Do not move.
 */
app.use(errorHandler);

app.listen(process.env.PORT || port, () => {
  console.log(`server is running at port ${port}`);
});
