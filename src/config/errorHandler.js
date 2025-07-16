const errorHandler = async (err, req, res, next) => {
  const errorMsg = err?.message || "Internal server error.";
  const status = err?.status || 500;
  const success = false;

  res.status(status).json({ message: errorMsg, success: success });
};

module.exports = errorHandler;
