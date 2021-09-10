const routeHandler = (req, res) => {
  res
    .status(404)
    .json({ success: false, message: "route not found on server" });
};

module.exports = { routeHandler };
