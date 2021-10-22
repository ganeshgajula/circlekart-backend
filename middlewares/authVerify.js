const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
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
      errorMessage: "Kindly Login",
    });
  }
};

module.exports = { authVerify };
