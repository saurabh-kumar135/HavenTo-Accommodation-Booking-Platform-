exports.pageNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    pageTitle: "404 - Page Not Found",
  });
};
