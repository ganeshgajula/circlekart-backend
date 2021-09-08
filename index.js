require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const products = require("./routes/products.router");
const users = require("./routes/users.router");
const carts = require("./routes/carts.router");
const wishlists = require("./routes/wishlists.router");
const initializeDbConnection = require("./db/db.connect");

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

initializeDbConnection();

const authVerify = (req, res, next) => {
  const token = req.headers.authorization;
  console.log({ token });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log({ decoded });
    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access, please add the correct token.",
    });
  }
};

app.use("/products", products);
app.use("/users", users);
app.use(authVerify);
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
