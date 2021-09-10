const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occurred, kindly check the error message for more details.",
    errorMessage: error.message,
  });
};

module.exports = { errorHandler };
