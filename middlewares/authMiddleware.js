const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
    if (req.accepts("html")) {
    // remember where they were trying to go
    return res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
    }
  return res.status(401).json({ message: "Not authorized" });
}


    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    res.locals.user = req.user; // available in EJS (header)
    next();
  } catch (e) {
    return res.redirect("/login");
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") return res.status(403).send("Access denied");
  next();
};
